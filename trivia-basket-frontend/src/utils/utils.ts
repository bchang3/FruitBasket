import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
