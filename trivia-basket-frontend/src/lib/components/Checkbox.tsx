import * as React from "react";
import MaterialUICheckbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  color?: "blue" | "yellow";
}

export default function Checkbox({
  label,
  onChange,
  color = "blue",
  checked,
}: CheckboxProps) {
  const gray = "#AAAAAA";
  const blue = "#0448AB";
  const yellow = "#E9C46A";
  const light_blue = "#D1E3FA";
  const light_yellow = "#FFEAB5";
  return (
    <FormControlLabel
      control={
        <MaterialUICheckbox
          inputProps={{ "aria-label": label }}
          disableRipple
          onChange={onChange}
          checked={checked}
          sx={{
            color: gray,
            "&.Mui-checked": {
              color: color === "blue" ? blue : yellow,
            },
            "&:hover": {
              backgroundColor: color === "blue" ? light_blue : light_yellow,
              padding: "4px",
              margin: "5px",
            },
          }}
        />
      }
      slotProps={{
        typography: {
          sx: {
            userSelect: "none",
            color: "#565656",
            fontWeight: 500,
            fontSize: "0.875rem", // Tailwind's `text-sm`
            fontFamily: "Poppins, sans-serif",
          },
        },
      }}
      onClick={(e) => e.stopPropagation()}
      label={label}
    />
  );
}
