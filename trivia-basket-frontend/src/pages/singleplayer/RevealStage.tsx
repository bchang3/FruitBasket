import { SinglePlayerQuestion } from "@/lib/data/singlePlayerQuestions";

interface RevealStageProps {
  question: SinglePlayerQuestion;
  wasCorrect: boolean;
  score: number;
}

export default function RevealStage({
  question,
  wasCorrect,
  score,
}: RevealStageProps) {
  const correctOption = question.questionOptions.find(
    (option) => option.questionOptionID === question.questionAnswer,
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full justify-center">
      <div
        className={`text-4xl font-bold ${
          wasCorrect ? "text-primary-green" : "text-red-500"
        }`}
      >
        {wasCorrect ? "Correct!" : "Not quite!"}
      </div>
      <div className="text-2xl text-center">
        The answer was{" "}
        <span className="font-bold">{correctOption?.questionOptionText}</span>
      </div>
      <div className="text-xl font-semibold text-primary-green">
        Score: {score}
      </div>
    </div>
  );
}
