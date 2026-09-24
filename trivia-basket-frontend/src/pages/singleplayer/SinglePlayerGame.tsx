import { useEffect, useState } from "react";
import {
  SinglePlayerQuestion,
  fetchSinglePlayerQuestions,
} from "@/lib/data/singlePlayerQuestions";
import GuessStage from "@/lib/components/single-player/GuessStage";
import RevealStage from "@/lib/components/single-player/RevealStage";
import EndStage from "@/lib/components/single-player/EndStage";
import LoadingScreen from "@/lib/components/LoadingScreen";

const NUM_ROUNDS = 8;
const GUESS_TIME = 15;
const REVEAL_TIME = 5;

type Stage = "Guess" | "Reveal" | "End";

export default function SinglePlayerGame() {
  const [questions, setQuestions] = useState<SinglePlayerQuestion[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [stage, setStage] = useState<Stage>("Guess");
  const [score, setScore] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);

  const loadQuestions = () => {
    setLoadError(false);
    setQuestions([]);
    fetchSinglePlayerQuestions(NUM_ROUNDS)
      .then((qs) => setQuestions(qs))
      .catch((err) => {
        console.error("Error loading single player questions", err);
        setLoadError(true);
      });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Advance from Reveal -> next Guess (or End) after REVEAL_TIME seconds
  useEffect(() => {
    if (stage !== "Reveal") return;

    const timeout = setTimeout(() => {
      if (currentRound === questions.length) {
        setStage("End");
      } else {
        setCurrentRound(currentRound + 1);
        setStage("Guess");
      }
    }, 1000 * REVEAL_TIME);

    return () => clearTimeout(timeout);
  }, [stage]);

  const handleAnswer = (optionID: number | null) => {
    const question = questions[currentRound];
    const correct = optionID !== null && optionID === question.questionAnswer;
    setLastCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 100);
    }
    setStage("Reveal");
  };

  const handlePlayAgain = () => {
    setCurrentRound(0);
    setScore(0);
    setStage("Guess");
    loadQuestions();
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
        <div className="text-2xl font-semibold">
          Couldn&apos;t load questions. Please try again.
        </div>
        <button
          onClick={loadQuestions}
          className="border-2 border-black rounded-lg px-6 py-3 text-xl font-semibold bg-primary-green text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <LoadingScreen />;
  }

  if (stage === "End") {
    return (
      <EndStage
        score={score}
        totalRounds={questions.length}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const question = questions[currentRound];

  if (stage === "Guess") {
    return (
      <GuessStage
        question={question}
        guessTime={GUESS_TIME}
        onAnswer={handleAnswer}
      />
    );
  }

  return (
    <RevealStage question={question} wasCorrect={lastCorrect} score={score} />
  );
}
