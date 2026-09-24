import { cn, GameState, getPlayerPlace, Player } from "@/utils/utils";
import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { PlayerBar } from "../PlayerBar";

interface GuessScreenProps {
  socket: Socket;
  gameState: GameState;
  lobbyID: string;
  player: Player;
  isSinglePlayer?: boolean;
  onGuess?: (guess: number) => void;
}
export default function GuessScreen({
  socket,
  gameState,
  lobbyID,
  player,
  isSinglePlayer,
  onGuess,
}: GuessScreenProps) {
  const [idx, setIdx] = useState<number>(0);
  const [guessed, setGuessed] = useState<boolean>(false);

  const saveGuess = (guess: number) => {
    if (isSinglePlayer) {
      onGuess?.(guess);
    } else {
      socket.emit("savePlayerGuess", lobbyID, guess);
    }
  };

  return (
    <div className="h-full font-poppins">
      <PlayerBar
        player={player}
        place={getPlayerPlace(gameState, player)}
        timer={true}
        duration={gameState.guessTime}
        startDate={gameState.roundStartTime}
      />
      <div className="flex flex-col items-center w-full gap-4 mt-32 h-2/3 md:h-full align-top justify-between pb-6 md:pb-48">
        <div className="flex flex-col items-center w-full gap-16">
          <h1 className="text-xl md:text-5xl font-bold md:mb-4 text-primary-green text-center">
            Q{gameState.currentRound}. {gameState.currentQuestion.questionText}
          </h1>
          {!guessed && (
            <div className="flex flex-col gap-4 md:w-3/4 w-full text-white font-semibold text-lg md:text-2xl">
              {gameState.currentQuestion.questionOptions.map(
                (questionOption) => {
                  return (
                    <button
                      key={questionOption.questionOptionID}
                      className={cn(
                        "bg-primary-chestnut p-4 rounded-full cursor-pointer w-full text-left focus:border-black focus:border-4",
                      )}
                      onClick={() => {
                        saveGuess(questionOption.questionOptionID);
                        setGuessed(true);
                      }}
                    >
                      {questionOption.questionOptionLabel}.{" "}
                      {questionOption.questionOptionText}
                    </button>
                  );
                },
              )}
            </div>
          )}
          {guessed && !isSinglePlayer && (
            <div className="text-xl md:text-3xl font-semibold text-primary-chestnut">
              Waiting for others to finish guessing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
