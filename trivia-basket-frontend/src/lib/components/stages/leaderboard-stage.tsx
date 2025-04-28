import { Socket } from "socket.io-client";
import Leaderboard from "./leaderboard";
import { useState } from "react";
import {
  GameState,
  getCorrectAnswerOption,
  getPlayerPlace,
  Player,
} from "@/utils/utils";
import { PlayerBar } from "../PlayerBar";
import Button from "../Button";

interface RevealProps {
  socket: Socket;
  lobbyID: string;
  gameState: GameState;
  player: Player;
}

export default function LeaderboardScreen({
  socket,
  player,
  lobbyID,
  gameState,
}: RevealProps) {
  return (
    <div className="flex flex-row justify-center w-full min-h-full h-fit font-poppins">
      <PlayerBar
        player={player}
        place={getPlayerPlace(gameState, player)}
        timer={true}
        duration={gameState.displayTime}
        startDate={gameState.roundStartTime}
      />
      <div className="flex flex-col items-center w-full md:w-2/3 font-poppins gap-4 mt-16 md:mt-24 min-h-full h-fit align-top justify-center pb-24 md:pb-48">
        <Leaderboard gameState={gameState} />
      </div>
    </div>
  );
}
