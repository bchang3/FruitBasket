import React from "react";
import { cn } from "../../utils/utils";
import Button, { ButtonProps } from "./Button";
import Link from "next/link";

export interface LinkButtonProps extends ButtonProps {
  link: string;
}

export default function LinkButton({ link, ...props }: LinkButtonProps) {
  return (
    <Link href={link}>
      <Button {...props}></Button>
    </Link>
  );
}
