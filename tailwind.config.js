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
      "light", // fallback/alternative theme
    ],
  },
}
