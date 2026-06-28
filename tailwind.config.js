/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        librisDark: {
          "primary": "#6366f1",     // Indigo
          "secondary": "#a855f7",   // Purple
          "accent": "#14b8a6",      // Teal
          "neutral": "#1e1e2f",     // Dark grey-blue
          "base-100": "#0f172a",    // Slate-900 (deep background)
          "base-200": "#1e293b",    // Slate-800
          "base-300": "#334155",    // Slate-700
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      {
        librisLight: {
          "primary": "#4f46e5",     // Indigo-600
          "secondary": "#9333ea",   // Purple-600
          "accent": "#0d9488",      // Teal-600
          "neutral": "#1f2937",     // Gray-800
          "base-100": "#f8fafc",    // Slate-50 (pure light background)
          "base-200": "#f1f5f9",    // Slate-100
          "base-300": "#e2e8f0",    // Slate-200
          "info": "#06b6d4",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
      "cupcake",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "forest",
      "aqua",
      "luxury",
      "dracula",
      "business",
      "night",
      "coffee",
      "winter",
      "sunset",
      "nord"
    ],
  },
}
