import { Socket } from "socket.io-client";
import Leaderboard from "./leaderboard";
import { useState } from "react";
import {
  GameState,
  getCorrectAnswerOption,
  getPlayerPlace,
  Player,
  toastSuccess,
} from "@/utils/utils";
import { PlayerBar } from "../PlayerBar";
import Button from "../Button";

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
  const addFlashcard = async (inputs: {
    username: string;
    questionID: number;
  }) => {
    const res = await fetch("/api/addFlashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
    if (res.ok) {
      toastSuccess("Saved flashcard!");
    }
  };
  return (
    <div className="min-h-full h-fit font-poppins">
      <PlayerBar
        player={player}
        place={getPlayerPlace(gameState, player)}
        timer={true}
        duration={gameState.displayTime}
        startDate={gameState.roundStartTime}
      />
      <div className="flex flex-col items-center w-full font-poppins gap-4 mt-16 md:mt-24 min-h-full h-fit align-top justify-center pb-24 md:pb-48">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary-green">
          Answer:
        </h1>
        <div className="text-2xl md:text-4xl font-semibold mb-4 text-primary-green">
          {getCorrectAnswerOption(gameState.currentQuestion).questionOptionText}
        </div>
        <Button
          content="Save Question as Flashcard"
          className="rounded-full px-4 text-xl"
          onClick={() =>
            addFlashcard({
              username: player.username,
              questionID: gameState.currentQuestion.questionID,
            })
          }
        />
      </div>
    </div>
  );
}
