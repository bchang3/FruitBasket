import express from "express";
import { Server } from "socket.io";
import mysql from "mysql2";
import http from "http";

import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT || "8000", 10);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "fruit-basket-db",
});

export interface Player {
  id: string;
  username: string;
  name: string;
  profileIcon: string;
  profileColor: string;
  points: number;
  currentResponse: string;
}

export interface GameState {
  stage: "Lobby" | "Prompt" | "Guess" | "Reveal" | "Leaderboard" | "End";
  players: Player[];
  categories: string[];
  disconnectedPlayers: Player[];
  numRounds: number;
  currentRound: number;
  currentQuestion?: Question;
  roundStartTime: number;
  displayTime: number;
  guessTime: number;
}

export interface Question {
  questionID: string;
  questionText: string;
  questionOptions: QuestionOption[];
  questionCategory: string;
  questionAnswer?: number; // withheld from clients until the Reveal stage
  firstAnswerTime?: number;
}

export interface QuestionShell {
  questionID: string;
  questionText: string;
  answerOptionID: number;
  questionCategory: string;
}
export interface QuestionOption {
  questionOptionID: number;
  questionOptionLabel: string;
  questionOptionText: string;
}
// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
let lobbies = {};
let lobbyStates: { [key: string]: Game } = {};
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin (adjust for production)
    methods: ["GET", "POST"],
  },
});

const displayTime = 10;

// Timestamp-seeded IDs, bumped so two games or answers in the same second
// don't collide on the primary key.
let lastGeneratedID = 0;
function generateID() {
  lastGeneratedID = Math.max(
    lastGeneratedID + 1,
    Math.floor(Date.now() / 1000),
  );
  return lastGeneratedID;
}

class Game {
  lobbyID: string;
  gameState: GameState;
  responseIDs: string[];
  guessIDs: string[];
  questions: QuestionShell[];
  currentAnswer: number;
  ID: number;
  awaitDisplayTimeout: ReturnType<typeof setTimeout>;
  awaitGuessesTimeout: ReturnType<typeof setTimeout>;

  constructor(lobbyID) {
    this.lobbyID = lobbyID;
    // Game State
    this.gameState = {
      stage: "Lobby",
      players: [],
      disconnectedPlayers: [],
      numRounds: 10,
      categories: [],
      guessTime: 15,
      currentRound: 0,
      displayTime: displayTime,
      roundStartTime: Date.now(),
    };

    this.responseIDs = [];
    this.guessIDs = [];
    this.awaitDisplayTimeout;
    this.awaitGuessesTimeout;
  }
  /**
   * Clears current user responses on new prompt round
   */
  clearResponses() {
    this.responseIDs = []; //reset received response ID array
    this.gameState.players = this.gameState.players.map((player) => {
      return { ...player, currentResponse: "" };
    });
  }

  /**
   * Transitions game state to "Prompt" stage
   */
  startPromptStage() {
    console.log("Beginning **prompt** stage");
    this.gameState.stage = "Prompt";
    this.gameState.currentRound += 1;
    this.gameState.roundStartTime = Date.now();
    this.clearResponses();
    const qs = this.questions[this.gameState.currentRound - 1];
    const sql = "CALL getQuestionOptions(?)";
    if (!qs) {
      return;
    }
    connection.query(sql, [qs.questionID], (err, results) => {
      if (err) {
        console.error("Error getting question", err);
        return;
      }
      const [rows]: any = results;
      const questionOptions: QuestionOption[] = rows.map((packet) => {
        return {
          ...packet,
          questionOptionLabel: packet.optionLabel,
          questionOptionText: packet.optionValue,
        } as QuestionOption;
      });
      this.gameState.currentQuestion = {
        questionID: qs.questionID,
        questionText: qs.questionText,
        questionOptions: questionOptions,
        questionCategory: qs.questionCategory,
      };
      this.currentAnswer = qs.answerOptionID;
      this.gameState.roundStartTime = Date.now();
      this.awaitDisplayTimeout = setTimeout(() => {
        this.startGuessStage();
      }, 1000 * displayTime);
      io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
    });
  }
  /**
   * Transition game state to "Guess" stage
   */
  startGuessStage() {
    console.log("Beginning **guess** stage");
    this.guessIDs = [];
    this.gameState.roundStartTime = Date.now();
    this.gameState.stage = "Guess";
    this.awaitGuessesTimeout = setTimeout(
      () => {
        console.log("Awaiting guesses timed out!");
        this.startRevealStage();
      },
      1000 * (this.gameState.guessTime + 0.3),
    );
    io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
  }
  /**
   * Transition game state to "Reveal" stage
   */
  startRevealStage() {
    console.log("Beginning **reveal** stage");
    this.gameState.stage = "Reveal";
    if (this.gameState.currentQuestion) {
      this.gameState.currentQuestion.questionAnswer = this.currentAnswer;
    }
    this.gameState.roundStartTime = Date.now();
    this.awaitDisplayTimeout = setTimeout(() => {
      if (this.gameState.numRounds === this.gameState.currentRound) {
        this.endGame();
      } else {
        this.startLeaderboardStage();
      }
    }, 1000 * displayTime);
    io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
  }
  /**
   * Transition game state to "Leaderboard" stage
   */
  startLeaderboardStage() {
    console.log("Beginning **leaderboard** stage");
    this.gameState.stage = "Leaderboard";
    this.gameState.roundStartTime = Date.now();
    this.awaitDisplayTimeout = setTimeout(() => {
      this.startPromptStage();
    }, 1000 * displayTime);
    io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
  }
  /**
   * End game
   */
  endGame() {
    console.log(`GAME ENDED in lobby ${this.lobbyID}`);
    this.gameState.stage = "End";
    const sql = "UPDATE Game SET isFinished=1 WHERE gameID=?";
    connection.query(sql, [this.ID], (err, results) => {
      if (err) {
        console.error("Error saving game", err);
        return;
      }
      console.log("Saved game!");
    });
    setTimeout(
      () => {
        console.log(`Deleting game ${this.lobbyID}!`);
        delete lobbyStates[this.lobbyID];
        delete lobbies[this.lobbyID];
      },
      1000 * 60 * 5,
    ); //clear stored data after 5 minutes
    io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
  }
  /**
   *
   * @param {*} id player socket ID
   * @returns player object (reference)
   */
  getPlayerByID(id) {
    return this.gameState.players.find((player) => player.id === id);
  }
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("createLobby", (lobbyID) => {
    socket.join(lobbyID);
    if (!lobbies[lobbyID]) {
      lobbies[lobbyID] = [];
      lobbyStates[lobbyID] = new Game(lobbyID);
    }
    lobbies[lobbyID].push(socket.id);
    console.log(`Lobby ${lobbyID} created/updated: `, lobbies[lobbyID]);
    io.to(lobbyID).emit("gameStateUpdate", lobbyStates[lobbyID].gameState);
  });
  socket.on("joinLobby", (lobbyID) => {
    if (lobbies[lobbyID]) {
      socket.join(lobbyID);
      io.to(lobbyID).emit("gameStateUpdate", lobbyStates[lobbyID].gameState);
    }
  });
  socket.on("joinGame", (lobbyID, playerData) => {
    if (lobbies[lobbyID]) {
      lobbies[lobbyID].push(socket.id);
      const game = lobbyStates[lobbyID];
      const playerName = playerData.name;
      const username = playerData.username;
      if (playerName) {
        console.log(`${playerName} joined lobby ${lobbyID}`);
      }
      const prevSocketID = playerData.prev_id;
      console.log(prevSocketID);
      if (
        prevSocketID &&
        game.gameState.disconnectedPlayers.some(
          (player) => player.id === prevSocketID,
        )
      ) {
        //player previously disconnected, copy over old data
        const oldPlayerData = {
          ...game.gameState.disconnectedPlayers.find(
            (player) => player.id === prevSocketID,
          ),
        } as Player;
        oldPlayerData.id = socket.id;
        game.gameState.players.push(oldPlayerData);
        game.gameState.disconnectedPlayers =
          game.gameState.disconnectedPlayers.filter(
            (player) => player.id !== prevSocketID,
          );
        io.to(lobbyID).emit("gameStateUpdate", game.gameState);
        return;
      } else if (
        prevSocketID &&
        game.gameState.players.some((player) => player.id === prevSocketID)
      ) {
        //player is already connected but is connecting again (i.e., from a second tab)
        game.gameState.players = game.gameState.players.map((player) =>
          player.id === prevSocketID
            ? {
                ...player,
                id: socket.id,
                name: playerName ? playerName : player.name,
              }
            : player,
        );
        io.to(lobbyID).emit("gameStateUpdate", game.gameState);
        return;
      } else {
        //first time join, no relevant previous session exists
        if (playerName && game.gameState.stage === "Lobby") {
          //only allow joins in lobby stage of game
          game.gameState.players.push({
            id: socket.id,
            username: username,
            name: playerName,
            profileColor: playerData.profileColor,
            profileIcon: playerData.profileIcon,
            points: 0,
            currentResponse: "",
          });
          io.to(lobbyID).emit("gameStateUpdate", game.gameState);
        }
      }
    } else {
      socket.emit("error", "Lobby does not exist");
    }
  });

  socket.on("gameStart", (lobbyID) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      console.log(`GAME STARTED by ${game?.getPlayerByID(socket.id)?.name}`);
      const sql = "CALL initializeGame(?, ?, ?, ?)";
      game.ID = generateID();
      console.log("Game ID", game.ID);
      connection.query(
        sql,
        [
          game.gameState.categories.join(","),
          game.gameState.players.map((player) => player.username).join(","),
          game.gameState.numRounds,
          game.ID,
        ],
        function (err, results) {
          if (err) {
            console.error("Error starting game", err);
            return;
          }
          const sql2 = "CALL getGameQuestions(?)";
          connection.query(sql2, [game.ID], function (err, results) {
            if (err) {
              console.error("Error starting game", err);
              return;
            }
            const [rows]: any = results;
            game.questions = rows.map((packet) => {
              return { ...packet, questionCategory: packet.categoryName };
            });
            game.startPromptStage();
            io.to(lobbyID).emit("gameStateUpdate", game.gameState);
          });
        },
      );
    }
  });

  socket.on("setNumRounds", (lobbyID, numRounds) => {
    if (lobbies[lobbyID]) {
      console.log("Setting number of rounds to: ", numRounds);
      const game = lobbyStates[lobbyID];
      game.gameState.numRounds = numRounds;
      io.to(lobbyID).emit("gameStateUpdate", game.gameState);
    }
  });

  socket.on("setGuessTime", (lobbyID, guessTime) => {
    if (lobbies[lobbyID]) {
      console.log("Setting guess time to: ", guessTime);
      const game = lobbyStates[lobbyID];
      game.gameState.guessTime = guessTime;
      io.to(lobbyID).emit("gameStateUpdate", game.gameState);
    }
  });

  socket.on("setCategories", (lobbyID, categories) => {
    if (lobbies[lobbyID]) {
      console.log("Setting categories to:", categories);
      const game = lobbyStates[lobbyID];
      game.gameState.categories = categories;
      io.to(lobbyID).emit("gameStateUpdate", game.gameState);
    }
  });

  socket.on("removePlayer", (lobbyID, id) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      console.log("Removing player", game.getPlayerByID(id)?.name, id);
      game.gameState.players = game.gameState.players.filter(
        (player) => player.id !== id,
      );
      game.gameState.disconnectedPlayers =
        game.gameState.disconnectedPlayers.filter((player) => player.id !== id);
      io.to(lobbyID).emit("gameStateUpdate", game.gameState);
    }
  });

  socket.on("savePlayerResponse", (lobbyID, response) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      const player = game.getPlayerByID(socket.id);
      if (player) {
        console.log("Setting response:", player.name);
        player.currentResponse = response.toLowerCase();
        if (!game.responseIDs.includes(socket.id)) {
          game.responseIDs.push(socket.id);
        }
        if (game.responseIDs.length === game.gameState.players.length) {
          console.log(`All ${game.responseIDs.length} responses received!`);
          game.startGuessStage();
          clearTimeout(game.awaitDisplayTimeout);
        }
      }
    }
  });

  socket.on("savePlayerGuess", (lobbyID, guess) => {
    const game = lobbyStates[lobbyID];
    if (
      lobbies[lobbyID] &&
      game.gameState.currentQuestion &&
      game.gameState.stage === "Guess"
    ) {
      const player = game.getPlayerByID(socket.id);
      // only grade a player's first guess each round
      if (player && !game.guessIDs.includes(socket.id)) {
        console.log("Grading guess:", player.name);
        game.guessIDs.push(socket.id);
        if (game.guessIDs.length === 1 && game.gameState.currentQuestion) {
          game.gameState.currentQuestion.firstAnswerTime = Date.now();
        }
        const correct = guess === game.currentAnswer;
        let points = 0;
        if (correct && game.gameState.currentQuestion.firstAnswerTime) {
          points = 1000;
          if (game.guessIDs.length > 1) {
            const firstAnswerTime =
              game.gameState.currentQuestion.firstAnswerTime;
            const roundDuration = game.gameState.guessTime;
            const timeRemaining =
              roundDuration * 1000 -
              (firstAnswerTime - game.gameState.roundStartTime);
            const coeff = Math.log(1000 / 500) / timeRemaining;
            console.log("timeRemaining: ", timeRemaining);
            console.log("time elapsed: ", Date.now() - firstAnswerTime);
            points *= Math.exp(-coeff * (Date.now() - firstAnswerTime));
            points = Math.floor(points);
          }
        }
        player.points += points;
        console.log(player.points);
        const sql = "CALL createQuestionInstance(?,?,?,?,?,?,?,?)";
        const questionInstanceID = generateID();
        connection.query(
          sql,
          [
            questionInstanceID,
            new Date(game.gameState.roundStartTime),
            new Date(),
            points,
            game.gameState.currentQuestion.questionID,
            game.ID,
            player.username,
            guess,
          ],
          function (err, results) {
            if (err) {
              console.error("Error saving question instance", err);
              return;
            }
            console.log("Saved question instance!");
          },
        );
        if (game.guessIDs.length === game.gameState.players.length) {
          console.log(`All ${game.guessIDs.length} guesses received!`);
          game.startRevealStage();
          clearTimeout(game.awaitGuessesTimeout);
        }
      }
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    for (const lobbyID in lobbies) {
      const game = lobbyStates[lobbyID];
      if (game.gameState.players.some((player) => player.id === socket.id)) {
        console.log(
          "Player disconnected:",
          game.getPlayerByID(socket.id)?.name,
          socket.id,
        );
        if (game.gameState.stage !== "End") {
          game.gameState.disconnectedPlayers.push(
            game.gameState.players.find(
              (player) => player.id === socket.id,
            ) as Player,
          );
          game.gameState.players = game.gameState.players.filter(
            (player) => player.id !== socket.id,
          );
          if (game.gameState.players.length === 0) {
            console.log(`Deleting game ${lobbyID}!`);
            delete lobbyStates[lobbyID];
            delete lobbies[lobbyID];
          }
          io.to(lobbyID).emit("gameStateUpdate", game.gameState);
        }
      }
    }
  });
});

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${PORT}`);
});