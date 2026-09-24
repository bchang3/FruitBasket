import { useEffect, useMemo, useState } from "react";
import {
  Question,
  shuffleOptions,
} from "@/lib/data/singlePlayerQuestions";

interface GuessStageProps {
  question: Question;
  guessTime: number;
  onAnswer: (optionID: number | null) => void;
}

export default function GuessStage({
  question,
  guessTime,
  onAnswer,
}: GuessStageProps) {
  const [timeLeft, setTimeLeft] = useState(guessTime);
  const [selected, setSelected] = useState<string | null>(null);

  const options = useMemo(
    () => shuffleOptions(question.questionOptions),
    [question],
  );

  useEffect(() => {
    setTimeLeft(guessTime);
    setSelected(null);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onAnswer(selected !== null ? Number(selected) : null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelected(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full h-full justify-center">
      <div className="text-lg font-semibold text-primary-green">
        {question.questionCategory} · {timeLeft}s
      </div>
      <div className="text-3xl font-bold text-center w-2/3">
        {question.questionText}
      </div>
      <div className="grid grid-cols-2 gap-4 w-2/3">
        {options.map((option, index) => (
          <button
            key={index}
            value={option.questionOptionID}
            onClick={handleSelect}
            className={`border-2 border-black rounded-lg p-4 text-xl font-semibold ${
              selected === option.questionOptionID
                ? "bg-primary-green text-white"
                : "bg-white"
            }`}
          >
            {option.questionOptionText}
          </button>
        ))}
      </div>
    </div>
  );
}
