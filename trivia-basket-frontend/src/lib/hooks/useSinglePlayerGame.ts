import { useEffect, useRef, useState } from "react";
import { GameState, Player, Question, QuestionOption } from "@/utils/utils";

const promptTime = 3;

export interface SinglePlayerSettings {
  categories: string[];
  numRounds: number;
  guessTime: number;
}

/**
 * Runs a single player game locally, mirroring the stage flow of the
 * multiplayer game server: Prompt -> Guess -> Reveal -> ... -> End
 */
export default function useSinglePlayerGame(player: Player | null) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const gameStateRef = useRef<GameState | null>(null);
  const questionsRef = useRef<Question[]>([]);
  const gameIDRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const updateGameState = (update: Partial<GameState>) => {
    if (!gameStateRef.current) {
      return;
    }
    gameStateRef.current = { ...gameStateRef.current, ...update };
    setGameState(gameStateRef.current);
  };

  const startGame = async (settings: SinglePlayerSettings) => {
    if (!player) {
      return;
    }
    setLoading(true);
    const res = await fetch("/api/singleplayer/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categories: settings.categories,
        numRounds: settings.numRounds,
      }),
    });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const { gameID, questions } = await res.json();

    const fullQuestions: Question[] = [];
    for (const question of questions) {
      const optionsRes = await fetch(
        `/api/singleplayer/options?questionID=${question.questionID}`,
      );
      const questionOptions: QuestionOption[] = await optionsRes.json();
      fullQuestions.push({ ...question, questionOptions });
    }

    gameIDRef.current = gameID;
    questionsRef.current = fullQuestions;
    gameStateRef.current = {
      stage: "Prompt",
      players: [{ ...player, points: 0 }],
      numRounds: fullQuestions.length,
      categories: settings.categories,
      currentRound: 0,
      currentQuestion: fullQuestions[0],
      roundStartTime: Date.now(),
      displayTime: promptTime,
      promptTime: promptTime,
      guessTime: settings.guessTime,
    };
    setLoading(false);
    startPromptStage(1);
  };

  const startPromptStage = (round: number) => {
    updateGameState({
      stage: "Prompt",
      currentRound: round,
      currentQuestion: questionsRef.current[round - 1],
      roundStartTime: Date.now(),
    });
    timeoutRef.current = setTimeout(() => startGuessStage(), 1000 * promptTime);
  };

  const startGuessStage = () => {
    updateGameState({ stage: "Guess", roundStartTime: Date.now() });
    timeoutRef.current = setTimeout(
      () => startRevealStage(),
      1000 * (gameStateRef.current?.guessTime ?? 0),
    );
  };

  const startRevealStage = () => {
    clearTimeout(timeoutRef.current);
    updateGameState({ stage: "Reveal", roundStartTime: Date.now() });
  };

  const submitGuess = (guess: number) => {
    const state = gameStateRef.current;
    if (!state || state.stage !== "Guess") {
      return;
    }
    const correct = guess === state.currentQuestion.questionAnswer;
    let points = 0;
    if (correct) {
      points = 1000;
      const roundDuration = state.guessTime;
      const timeRemaining = roundDuration * 1000;
      const coeff = Math.log(1000 / 400) / timeRemaining;
      points *= Math.exp(-coeff * (Date.now() - state.roundStartTime));
      points = Math.floor(points);
    }

    fetch("/api/singleplayer/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameID: gameIDRef.current,
        questionID: state.currentQuestion.questionID,
        userAnswer: guess,
        points,
        createdAt: state.roundStartTime,
      }),
    });

    updateGameState({
      players: state.players.map((p) => ({ ...p, points: p.points + points })),
    });
    startRevealStage();
  };

  const nextRound = () => {
    const state = gameStateRef.current;
    if (!state) {
      return;
    }
    if (state.currentRound >= state.numRounds) {
      endGame();
    } else {
      startPromptStage(state.currentRound + 1);
    }
  };

  const endGame = () => {
    fetch("/api/singleplayer/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID: gameIDRef.current }),
    });
    updateGameState({ stage: "End" });
  };

  const resetGame = () => {
    clearTimeout(timeoutRef.current);
    gameStateRef.current = null;
    setGameState(null);
  };

  return { gameState, loading, startGame, submitGuess, nextRound, resetGame };
}
