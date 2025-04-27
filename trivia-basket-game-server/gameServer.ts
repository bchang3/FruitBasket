
import express from "express"
import { Server } from "socket.io"
import http from "http"


export interface Player {
  id: string;
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
  currentQuestion: string;
  roundStartTime: number;
  guessTime: number;
}

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
let lobbies = {};
let lobbyStates: {[key: string]: Game} = {};
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin (adjust for production)
    methods: ["GET", "POST"],
  },
});

const displayTime = 10;
class Game {
  lobbyID: string
  gameState: GameState
  responseIDs: string[]
  guessIDs: string[]
  awaitQuestionsTimeout: ReturnType<typeof setTimeout>
  awaitGuessesTimeout: ReturnType<typeof setTimeout>

  constructor(lobbyID) {
    this.lobbyID = lobbyID;
    // Game State
    this.gameState = {
      stage: 'Lobby',
      players: [],
      disconnectedPlayers: [],
      numRounds: 10,
      categories:[],
      guessTime: 30,
      currentRound: 0,
      currentQuestion: "",
      roundStartTime: Date.now()
    };

    this.responseIDs = [];
    this.guessIDs = [];
    this.awaitQuestionsTimeout;
    this.awaitGuessesTimeout;
  }
  /**
   * Clears current user responses on new prompt round
   */
  clearResponses() {
    this.responseIDs = []; //reset received response ID array
    this.gameState.players = this.gameState.players.map((player) => {
      return {...player, currentResponse: ""}
    })
  }

  /**
   * Get a random question from `questions.txt`
   * @returns question string
   */
  getQuestion() {
    return "";
  }
  /**
   * Transitions game state to "Prompt" stage
   */
  startPromptStage() {
    console.log("Beginning **prompt** stage")
    this.gameState.stage = "Prompt";
    this.gameState.currentRound += 1;
    this.clearResponses();
    this.gameState.currentQuestion = this.getQuestion();
    this.gameState.roundStartTime = Date.now();
    this.awaitQuestionsTimeout = setTimeout(() => {
      this.startGuessStage();
    }, 1000 * (displayTime));
    io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
  }
  /**
   * Transition game state to "Guess" stage
   */
  startGuessStage() {
    console.log("Beginning **guess** stage")
    this.guessIDs = []
    this.gameState.roundStartTime = Date.now();
    this.gameState.stage = "Guess";
    this.awaitGuessesTimeout = setTimeout(() => {
      console.log("Awaiting guesses timed out!")
      this.startRevealStage();
    }, 1000 * (this.gameState.guessTime + 5))
    io.to(this.lobbyID).emit("gameStateUpdate", this.gameState);
  }
  /**
   * Transition game state to "Reveal" stage
   */
  startRevealStage() {
    console.log("Beginning **reveal** stage")
    this.gameState.stage = "Reveal";
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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createLobby', (lobbyID) => {
    socket.join(lobbyID);
    if (!lobbies[lobbyID]) {
      lobbies[lobbyID] = [];
      lobbyStates[lobbyID] = new Game(lobbyID);
    }
    lobbies[lobbyID].push(socket.id);
    console.log(`Lobby ${lobbyID} created/updated: `, lobbies[lobbyID]);
    io.to(lobbyID).emit('gameStateUpdate',  lobbyStates[lobbyID].gameState)
  });
  socket.on("joinLobby", (lobbyID) => {
    if (lobbies[lobbyID]) {
      socket.join(lobbyID);
      io.to(lobbyID).emit('gameStateUpdate',  lobbyStates[lobbyID].gameState)
    }
  })
  socket.on('joinGame', (lobbyID, playerData) => {
    if (lobbies[lobbyID]) {
      lobbies[lobbyID].push(socket.id);
      const game = lobbyStates[lobbyID];
      const playerName = playerData.name;
      if (playerName) {  console.log(`${playerName} joined lobby ${lobbyID}`); };
      const prevSocketID = playerData.prev_id;
      console.log(prevSocketID);
      if (prevSocketID && game.gameState.disconnectedPlayers.some((player) => player.id === prevSocketID)) {
        //player previously disconnected, copy over old data
        const oldPlayerData = {...game.gameState.disconnectedPlayers.find((player) => player.id === prevSocketID)} as Player;
        oldPlayerData.id = socket.id;
        game.gameState.players.push(oldPlayerData);
        game.gameState.disconnectedPlayers = game.gameState.disconnectedPlayers.filter((player) => player.id !== prevSocketID);
        io.emit('gameStateUpdate', game.gameState); 
        return;
      } else if (prevSocketID && game.gameState.players.some((player) => player.id === prevSocketID)) {
        //player is already connected but is connecting again (i.e., from a second tab)
        game.gameState.players = game.gameState.players.map((player) => player.id === prevSocketID ? {...player, id: socket.id, name: playerName ? playerName : player.name}: player);
        io.emit('gameStateUpdate', game.gameState); 
        return;
      } else {
        //first time join, no relevant previous session exists
        if (playerName && game.gameState.stage === "Lobby") {
          //only allow joins in lobby stage of game
          game.gameState.players.push({ id: socket.id, name: playerName, profileColor: playerData.profileColor, profileIcon: playerData.profileIcon, points: 0, currentResponse: "" });
          io.emit('gameStateUpdate', game.gameState); 
        }
      }
    } else {
        socket.emit('error', 'Lobby does not exist');
    }
});

  socket.on('gameEnd', (lobbyID) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      console.log(`GAME ENDED in lobby ${lobbyID} by ${game?.getPlayerByID(socket.id)?.name}`);
      game.gameState.stage = "End";
      setTimeout(() => {
        console.log(`Deleting game ${lobbyID}!`)
        delete lobbyStates[lobbyID];
        delete lobbies[lobbyID];
      }, 1000 * 60 * 5); //clear stored data after 5 minutes
      io.emit('gameStateUpdate', game.gameState);
    }
  });
  socket.on('gameStart', (lobbyID) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      console.log(`GAME STARTED by ${game?.getPlayerByID(socket.id)?.name}`);
      game.startPromptStage();
      io.emit('gameStateUpdate', game.gameState);
    }
  });

  socket.on('setNumRounds', (lobbyID, numRounds) => {
    if (lobbies[lobbyID]) {
      console.log('Setting number of rounds to: ', numRounds);
      const game = lobbyStates[lobbyID];
      game.gameState.numRounds = numRounds; 
      io.to(lobbyID).emit('gameStateUpdate', game.gameState)
    }
  });

  socket.on('setGuessTime', (lobbyID, guessTime) => {
    if (lobbies[lobbyID]) {
      console.log('Setting guess time to: ', guessTime);
      const game = lobbyStates[lobbyID];
      game.gameState.guessTime = guessTime; 
      io.to(lobbyID).emit('gameStateUpdate', game.gameState)
    }
  });

  socket.on('setCategories', (lobbyID, categories) => {
    if (lobbies[lobbyID]) {
      console.log('Setting categories to:', categories);
      const game = lobbyStates[lobbyID];
      game.gameState.categories = categories; 
      io.to(lobbyID).emit('gameStateUpdate', game.gameState)
    }
  });


  socket.on('removePlayer', (lobbyID, id) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      console.log('Removing player', game.getPlayerByID(id)?.name, id);
      game.gameState.players = game.gameState.players.filter((player) => player.id !== id)
      game.gameState.disconnectedPlayers = game.gameState.disconnectedPlayers.filter((player) => player.id !== id);
      io.emit('gameStateUpdate', game.gameState);
    }
    
  });

  socket.on("savePlayerResponse", (lobbyID, response) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      const player = game.getPlayerByID(socket.id);
      if (player) {
        console.log('Setting response:', player.name);
        player.currentResponse = response.toLowerCase();
        if (!game.responseIDs.includes(socket.id)) { game.responseIDs.push(socket.id) };
        if (game.responseIDs.length === game.gameState.players.length) {
          console.log(`All ${game.responseIDs.length} responses received!`);
          game.startGuessStage();
          clearTimeout(game.awaitQuestionsTimeout);
        }
      }
    }
  })

  socket.on("savePlayerGuess", (lobbyID, guess) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      const player = game.getPlayerByID(socket.id);
      if (player) {
        console.log('Grading guess:', player.name);
        if (!game.guessIDs.includes(socket.id)) { game.guessIDs.push(socket.id) };
        let numCorrect = 0;
        let points = 0;
        for (const [correctID, guessID] of Object.entries(guess)) {
          if (correctID === guessID) {
            numCorrect += 1;
            points += 100;
          }
        }
        if (numCorrect === game.gameState.players.length) {
          points *= 1.5;
        }
        player.points += points;
        console.log(player.points);
        if (game.guessIDs.length === game.gameState.players.length) {
          console.log(`All ${game.guessIDs.length} guesses received!`);
          game.startRevealStage();
          clearTimeout(game.awaitGuessesTimeout);
        }
      }
    }
  })

  socket.on("nextRound", (lobbyID, response) => {
    if (lobbies[lobbyID]) {
      const game = lobbyStates[lobbyID];
      console.log(`Moving to next round! - ${game?.getPlayerByID(socket.id)?.name}`);
      game.startPromptStage();
    }
  })
  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    for (const lobbyID in lobbies) {
      const game = lobbyStates[lobbyID];
      if (game.gameState.players.some((player) => player.id === socket.id)) {
        console.log('Player disconnected:', game.getPlayerByID(socket.id)?.name, socket.id);
        if (game.gameState.stage !== "End") {
          game.gameState.disconnectedPlayers.push(game.gameState.players.find((player) => player.id === socket.id) as Player);
          game.gameState.players = game.gameState.players.filter((player) => player.id !== socket.id);
          if (game.gameState.players.length === 0) {
            console.log(`Deleting game ${lobbyID}!`)
            delete lobbyStates[lobbyID];
            delete lobbies[lobbyID];
          }
          io.to(lobbyID).emit('gameStateUpdate', game.gameState);
        }
      }
    }
  });
});

// Start the server
const PORT = 8001;
server.listen(8001, '0.0.0.0', () => {
  console.log(`WebSocket server running on port ${PORT}`);
});