import { ClassValue, clsx } from "clsx";
import { Slide, toast, ToastOptions } from "react-toastify";
import { twMerge } from "tailwind-merge";

export interface Player {
  id: string;
  name: string;
  profileIcon: string;
  profileColor: string;
  points: number;
  currentResponse: string;
  isMatched: boolean;
}

export interface GameState {
  stage: "Lobby" | "Prompt" | "Guess" | "Reveal" | "End";
  players: Player[];
  numRounds: number;
  categories: string[];
  currentRound: number;
  currentQuestion: string;
  roundStartTime: number;
  promptTime: number;
  guessTime: number;
}

export function getPlayerByID(gameState: GameState, id: string) {
  const player = gameState.players.find((player) => player.id === id);
  if (!player) {
    throw new Error("Could not find player by id!");
  }
  return player;
}

export function getPlayerPlace(gameState: GameState, player: Player) {
  gameState.players.sort((a: Player, b: Player) => b.points - a.points);
  return gameState.players.findIndex((p) => p.id === player.id) + 1;
}

export const colorToHex = {
  red: "#ec4844",
  orange: "#feab44",
  yellow: "#f7e603",
  "yellow-green": "#88c146",
  green: "#88c146",
  turquoise: "#4ac1bb",
  "light-blue": "#49a2bd",
  "royal-blue": "#4a72bd",
  purple: "#8c49bd",
  magenta: "#c2489b",
};
export const colors = [
  "red",
  "orange",
  "yellow",
  "yellow-green",
  "green",
  "turquoise",
  "light-blue",
  "royal-blue",
  "purple",
  "magenta",
];

export const fruit_icons = [
  "mango",
  "orange",
  "strawberry",
  "peach",
  "pomegranate",
  "lemon",
  "pear",
  "plum",
  "apple",
];

/**
 * Example: className={cn(iconStyles, expanded ? "opacity-0" : "opacity-100")}
 * @returns merged Tailwind classes
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const toastParams: ToastOptions<unknown> = {
  position: "top-center",
  autoClose: 2000,
  closeOnClick: false,
  pauseOnHover: true,
  theme: "light",
  className: "rounded-xl flex flex-row items-center text-black",
  closeButton: false,
};

export const toastSuccess = (msg: string) =>
  toast.success(msg, {
    ...toastParams,
    autoClose: 2000,
    style: {
      fontFamily: "Poppins",
      color: "#01a949",
      background: "#FFF9EF",
    },
  });

export const toastError = (msg: string) =>
  toast.error(msg, {
    ...toastParams,
    autoClose: 2000,
    style: {
      fontFamily: "Poppins",
    },
  });
