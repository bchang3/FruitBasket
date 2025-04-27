import { Socket } from "socket.io-client";
import Leaderboard from "./leaderboard";
import { useState } from "react";
import { GameState, Player } from "@/utils/utils";

interface RevealProps {
  socket: Socket;
  lobbyID: string;
  gameState: GameState;
  player: Player;
}

export default function RevealScreen({
  socket,
  player,
  lobbyID,
  gameState,
}: RevealProps) {
  const [idx, setIdx] = useState<number>(0);
  // const displays = [
  //   <div
  //     className="flex flex-col gap-4 self-start w-full h-full overflow-scrol scrollbar-hidden"
  //     key={0}
  //   >
  //     {gameState.players.map((player, index) => (
  //       <ResponseCard
  //         droppedPlayer={player}
  //         key={index}
  //         responseText={player.currentResponse}
  //       />
  //     ))}
  //   </div>,
  //   <Leaderboard gameState={gameState} key={1} />,
  // ];
  const nextRound = () => {
    if (gameState.currentRound === gameState.numRounds) {
      socket.emit("gameEnd", lobbyID);
    } else {
      socket.emit("nextRound", lobbyID);
    }
  };
  return (
    <div className="min-h-full h-fit font-fuzzy_bubbles">
      {/* <PlayerBar player={player} place={getPlayerPlace(gameState, player)} />
      <div className="flex flex-col items-center w-full font-fuzzy_bubbles gap-4 mt-16 md:mt-24 min-h-full h-fit align-top justify-between pb-24 md:pb-48">
        <div className="flex flex-col items-center w-full min-h-full h-fit">
          <div className="flex flex-col mb-7 md:w-4/5 w-full mt-12 md:mt-24">
            <h1 className="text-3xl md:text-5xl font-bold md:mb-4">
              Round {gameState.currentRound}: Answers
            </h1>
            <div className="flex flex-col flex-1 justify-center gap-4 text-2xl md:text-3xl md:mt-0 mt-4">
              {gameState.currentQuestion}
            </div>
            <div className="hidden flex-row w-full mt-4 md:mt-12 justify-between md:flex">
              <div className="w-1/2">{displays[0]}</div>
              <div className="w-1/3">{displays[1]}</div>
            </div>
            <div className="flex flex-row w-full md:hidden mt-4 md:mt-12 items-center h-[300px] ">
              <img
                src="/click-left.svg"
                className="w-12 h-12 cursor-pointer"
                onClick={() => setIdx(0)}
              ></img>
              {displays[idx]}
              <img
                src="/click-right.svg"
                className="w-12 h-12 cursor-pointer"
                onClick={() => setIdx(1)}
              ></img>
            </div>
          </div>
        </div>
        <button
          className="group font-medium text-4xl relative mt-2"
          onClick={() => nextRound()}
        >
          {`${gameState.currentRound === gameState.numRounds ? "End game!" : "Next round!"}`}
          <span className="absolute top-[36px] left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
        </button>
      </div> */}
    </div>
  );
}
