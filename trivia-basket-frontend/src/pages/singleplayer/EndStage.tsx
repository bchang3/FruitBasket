import LinkButton from "@/lib/components/LinkButton";

interface EndStageProps {
  score: number;
  totalRounds: number;
  onPlayAgain: () => void;
}

export default function EndStage({
  score,
  totalRounds,
  onPlayAgain,
}: EndStageProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full h-full justify-center">
      <div className="text-5xl font-bold text-primary-green">Game Over!</div>
      <div className="text-2xl">
        You scored <span className="font-bold">{score}</span> points across{" "}
        {totalRounds} rounds.
      </div>
      <div className="flex gap-6">
        <button
          onClick={onPlayAgain}
          className="border-2 border-black rounded-lg px-6 py-3 text-xl font-semibold bg-primary-green text-white"
        >
          Play Again
        </button>
        <LinkButton content="Home" className="text-xl" link="/" />
      </div>
    </div>
  );
}
