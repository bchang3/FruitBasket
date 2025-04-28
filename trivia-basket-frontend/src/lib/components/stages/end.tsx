import { Socket } from "socket.io-client";
import Leaderboard from "./leaderboard";
import { GameState, getPlayerPlace, Player } from "@/utils/utils";
import { PlayerBar } from "../PlayerBar";

interface EndProps {
  socket: Socket;
  gameState: GameState;
  player: Player;
}

export default function EndScreen({ socket, player, gameState }: EndProps) {
  return (
    <div className="min-h-full font-poppins">
      <div className="flex flex-col items-center w-full font-fuzzy_bubbles gap-4 mt-16 md:mt-24 h-full align-top justify-between pb-24 md:pb-48">
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col mb-7 md:w-2/3 w-full mt-12 md:mt-24">
            <h1 className="text-5xl font-bold mb-4">Game over!</h1>
            <Leaderboard gameState={gameState} key={1} end={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
