import { Socket } from "socket.io-client";
import Leaderboard from "./leaderboard";
import { GameState, getPlayerPlace, Player } from "@/utils/utils";
import { PlayerBar } from "../PlayerBar";
import Button from "../Button";

interface EndProps {
  socket: Socket;
  gameState: GameState;
  player: Player;
  isSinglePlayer?: boolean;
  onPlayAgain?: () => void;
}

export default function EndScreen({
  socket,
  player,
  gameState,
  isSinglePlayer,
  onPlayAgain,
}: EndProps) {
  return (
    <div className="min-h-full font-poppins">
      <div className="flex flex-col items-center w-full font-fuzzy_bubbles gap-4 mt-16 md:mt-24 h-full align-top justify-between pb-24 md:pb-48">
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex flex-col mb-7 md:w-2/3 w-full mt-12 md:mt-24">
            <h1 className="text-5xl font-bold mb-4">Game over!</h1>
            {isSinglePlayer ? (
              <div className="flex flex-col items-center gap-8 text-primary-green">
                <div className="text-3xl font-semibold">
                  You earned {player.points} seeds across {gameState.numRounds}{" "}
                  questions!
                </div>
                <Button
                  content="Play Again"
                  className="rounded-full px-6 text-xl"
                  onClick={() => onPlayAgain?.()}
                />
              </div>
            ) : (
              <Leaderboard gameState={gameState} key={1} end={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
