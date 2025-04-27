import { GameState, getPlayerPlace } from "@/utils/utils";

interface LeaderboardProps {
  gameState: GameState;
  end?: boolean;
}

export default function Leaderboard({ gameState, end }: LeaderboardProps) {
  return (
    <div className="flex flex-col gap-4 w-full self-start">
      <h2 className="font-bold text-2xl">{`${end ? "Final Leaderboard" : "Leaderboard"}`}</h2>
      {gameState.players
        .sort((a, b) => {
          return getPlayerPlace(gameState, a) - getPlayerPlace(gameState, b);
        })
        .map((player, index) => (
          <div
            className="flex flex-row w-full justify-between border-b-[1px] border-gray-700"
            key={index}
          >
            <div>{player.name}</div>
            <div>{player.points} pts</div>
          </div>
        ))}
    </div>
  );
}
