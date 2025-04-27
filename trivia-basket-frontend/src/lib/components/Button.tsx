import React from "react";
import { cn } from "../../utils/utils";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  mode?: "primary" | "secondary";
  content: React.ReactNode;
  disabled?: boolean;
  buttonStyles?: string;
}

export default function Button({
  mode = "primary",
  content = "",
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  // Redefine using actual colors
  let styling =
    "bg-primary-chestnut font-poppins hover:bg-primary-light_chestnut cursor-pointer text-white";

  if (disabled) {
    styling = "bg-primary-chestnut text-white";
  } else if (mode === "secondary") {
    styling = "";
  }

  return (
    <button
      className={cn(
        `${styling} w-32 h-14 rounded-xl text-base font-semibold p-2 text-center`,
        className,
      )}
      {...props}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
