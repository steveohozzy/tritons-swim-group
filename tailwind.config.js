/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        triton: {
          purple: "#7135a8",
          dark: "#4b216f",
          mid: "#9463bd",
          lavender: "#eee5f6",
          soft: "#f8f5fb",
          navy: "#20213c",
          ink: "#242238",
          muted: "#777487",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Arial", "sans-serif"],
        display: ["var(--font-manrope)", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 35px rgba(36, 20, 55, .10)",
      },
    },
  },
  plugins: [],
};
