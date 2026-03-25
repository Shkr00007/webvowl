import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#10131A",
        panel: "#171B24",
        border: "#2A3140",
        accent: "#5B8CFF"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
