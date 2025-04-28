import { GameState, Player, getPlayerPlace } from "@/utils/utils";
import { FormEvent, ChangeEvent, useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { PlayerBar } from "../PlayerBar";

interface PromptScreenProps {
  gameState: GameState;
  player: Player;
}

export default function PromptScreen({ gameState, player }: PromptScreenProps) {
  return (
    <div className="font-poppins h-full">
      <PlayerBar
        player={player}
        place={getPlayerPlace(gameState, player)}
        timer={true}
        duration={gameState.displayTime}
        startDate={gameState.roundStartTime}
      />
      <div className="flex flex-col items-center w-full gap-4 h-full align-top justify-between pb-48 text-primary-green">
        <div className="flex flex-col gap-12 items-center justify-center w-full h-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Round {gameState.currentRound}
          </h1>
          {gameState.currentQuestion && (
            <div className="flex flex-col justify-center gap-4 text-3xl md:text-5xl text-center font-semibold">
              Q. {gameState.currentQuestion.questionText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
