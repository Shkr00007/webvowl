import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0F1220",
        panel: "#171B2C",
        border: "#2A3145",
        accent: "#5A8BFF"
      }
    }
  },
  plugins: []
} satisfies Config;
