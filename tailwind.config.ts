import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7EC",
        blush: { DEFAULT: "#FFD3E6", deep: "#F27FB0" },
        lilac: { DEFAULT: "#DCCDFF", deep: "#8F6FE0" },
        plum: { DEFAULT: "#4A2F75", soft: "#7A63A3" },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
        hand: ["Caveat", "cursive"],
        script: ["Pacifico", "cursive"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(74,47,117,0.28)",
        paper: "0 18px 40px -18px rgba(74,47,117,0.45), 0 2px 0 rgba(255,255,255,0.8) inset",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "40%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        flash: { "0%": { opacity: "0.95" }, "100%": { opacity: "0" } },
        rise: { "0%": { transform: "translateY(10px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      },
      animation: {
        pop: "pop 0.6s ease-out",
        flash: "flash 0.45s ease-out forwards",
        rise: "rise 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
