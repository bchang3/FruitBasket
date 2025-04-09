import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      mdlg: "900px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        zoomOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          blue: "#0448AB",
          gray: "#F4F6F9",
          yellow: "#FFAA00",
          navy: "#1B263B",
          light_blue: "#D1E3FA",
          light_gray: "#5A6E75",
        },
        secondary: {
          green: "#32A852",
          red: "#D9251D",
          light_red: "#FFE5E5",
          medium_red: "#ffc9c9",
          blue: "#033A8E",
          light_blue: "#9FC8FF",
          light_gray: "#EBEBEB",
          gray: "#AAAAAA",
          dark_gray: "#525252",
          blue_gray: "#F1F7F9",
          dark_blue_gray: "#3A545E",
          black: "#000000",
          light_green: "#A8D97B",
          medium_gray: "#C0C0C0",
          yellow: "#E9C46A",
          light_yellow: "#FFEAB5",
          yellow_gray: "#fcf0d2",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
