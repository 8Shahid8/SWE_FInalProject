/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Added ts, tsx for completeness based on Vite's default
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
