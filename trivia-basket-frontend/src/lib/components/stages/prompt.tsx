import { GameState, Player, getPlayerPlace } from "@/utils/utils";
import { FormEvent, ChangeEvent, useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";

interface PromptScreenProps {
  socket: Socket;
  gameState: GameState;
  lobbyID: string;
  player: Player;
}

export default function PromptScreen({
  socket,
  gameState,
  lobbyID,
  player,
}: PromptScreenProps) {
  const answerInputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const sendResponseTimeout = setTimeout(
      () => {
        const answer = answerInputRef.current?.value;
        socket.emit("savePlayerResponse", lobbyID, answer);
      },
      1000 *
        Math.floor(
          gameState.promptTime - (Date.now() - gameState.roundStartTime) / 1000,
        ),
    );
    return () => clearTimeout(sendResponseTimeout);
  }, []);
  return (
    <div className="font-fuzzy_bubbles h-full">
      {/* <PlayerBar
        player={player}
        place={getPlayerPlace(gameState, player)}
        timer={true}
        duration={gameState.promptTime}
        startDate={gameState.roundStartTime}
      />
      <div className="flex flex-col items-center w-full gap-4 mt-32 h-full align-top justify-between pb-48">
        <div className="flex flex-col items-center w-full h-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Round {gameState.currentRound}
          </h1>
          <div className="flex flex-col flex-1 justify-center gap-4">
            <div className="text-2xl md:text-3xl">Question:</div>
            <QuestionCard question={gameState.currentQuestion} />
          </div>
        </div>

        <form className="flex flex-col items-center justify-center gap-4 mt-12 md:w-[900px] w-full">
          <div className="flex flex-row justify-between w-full text-3xl self-start items-end">
            Answer:
            <IconTimer
              duration={gameState.promptTime}
              startDate={gameState.roundStartTime}
            />
          </div>
          <textarea
            className="border-2 border-black rounded-md h-36 md:h-48 pt-2 pb-1 px-2 self-center w-full overflow-x-auto text-xl"
            ref={answerInputRef}
            placeholder=""
          />
        </form>
      </div> */}
    </div>
  );
}
