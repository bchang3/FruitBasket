import { colorToHex, Player, toastSuccess } from "@/utils/utils";
import React, { useState } from "react";

interface NameCardProps {
  player: Player;
  removePlayer?: (player: Player) => void;
}

export const NameCard: React.FC<NameCardProps> = ({ player, removePlayer }) => {
  function handleDeletePlayer(player: Player) {
    if (removePlayer) {
      removePlayer(player);
    }
    toastSuccess("Successfully deleted player");
  }

  return (
    <div className="flex flex-row items-center border-2 p-4 rounded-lg shadow-md w-full">
      <div className="mr-4">
        <img
          src={`/fruit-icons/${player.profileIcon}.png`}
          alt="Fruit Icon"
          className=" w-6 h-6 md:w-12 md:h-12 rounded-full p-2"
          style={{
            backgroundColor: `${colorToHex[player.profileColor as keyof typeof colorToHex]}`,
          }}
        />
      </div>

      <h3 className="flex-1 text-sm md:text-lg font-bold text-chestnut truncate">
        {player.name}
      </h3>

      {removePlayer && (
        <button
          className="group font-medium text-xl ml-3 relative overflow-hidden select-none"
          onClick={() => handleDeletePlayer(player)}
        >
          ✖
          <span className="absolute top-[20px] left-0 bottom-0 w-0 h-[2px] bg-primary-green mt-1 transition-all duration-300 group-hover:w-full"></span>
        </button>
      )}
    </div>
  );
};
