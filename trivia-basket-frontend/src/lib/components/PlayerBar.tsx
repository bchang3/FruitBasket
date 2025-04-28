import React, { useState } from "react";
import { colorToHex, Player } from "@/utils/utils";
import { BarTimer } from "./BarTimer";

interface PlayerBarProps {
  player: Player;
  place: number;
  timer?: boolean;
  duration?: number;
  startDate?: number;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  player,
  place,
  timer,
  duration,
  startDate,
}) => {
  return (
    <div className="flex flex-col w-screen absolute top-0 left-0 bg-primary-beige">
      <div className="flex flex-row gap-2 items-center py-2 px-4 justify-between border-b-1 border-black">
        <div className="flex flex-row gap-2 items-center">
          <div>
            <img
              src="/trivia-basket-logo.svg"
              className="h-16 w-auto"
              alt="trivia basket logo"
            />
          </div>
        </div>
        <div className="flex flex-row items-center self-start justify-between h-20">
          <div className="flex flex-row gap-2 md:gap-3">
            <h3 className="flex flex-row flex-1 text-lg font-bold text-gray-800 truncate self-center">
              <span className="min-w-32 md:min-w-0">Rank: #{place}</span>
              <span className="hidden md:flex">, Seeds: {player.points}</span>
            </h3>
            <img
              className="rounded-full p-2 w-16 border-black border-2 cursor-pointer"
              src={`/fruit-icons/${player.profileIcon}.png`}
              style={{
                backgroundColor: `${colorToHex[player.profileColor as keyof typeof colorToHex]}`,
              }}
              alt="profile-icon"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-fit">
        {timer && duration && startDate && (
          <BarTimer duration={duration} startDate={startDate} />
        )}
      </div>
    </div>
  );
};
