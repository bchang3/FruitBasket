import { colorToHex, GameState, getPlayerPlace } from "@/utils/utils";

interface LeaderboardProps {
  gameState: GameState;
  end?: boolean;
}

export default function Leaderboard({ gameState, end }: LeaderboardProps) {
  return (
    <div className="flex flex-col gap-6 w-full self-start">
      <h2 className="font-bold text-2xl md:text-4xl text-primary-green">{`${end ? "Final Leaderboard" : "Leaderboard"}`}</h2>
      {gameState.players
        .sort((a, b) => {
          return getPlayerPlace(gameState, a) - getPlayerPlace(gameState, b);
        })
        .map((player, index) => (
          <div
            className="flex flex-row items-center px-4 py-2 w-full text-white font-semibold text-xl md:text-2xl justify-between rounded-full bg-primary-chestnut"
            key={index}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                className="rounded-full p-2 w-16 border-black border-2 cursor-pointer"
                src={`/fruit-icons/${player.profileIcon}.png`}
                style={{
                  backgroundColor: `${colorToHex[player.profileColor as keyof typeof colorToHex]}`,
                }}
                alt="profile-icon"
              />
              {player.name}
            </div>
            <div>{player.points} seeds</div>
          </div>
        ))}
    </div>
  );
}
