/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ CORREGIDO: Apunta a todas las carpetas correctas
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}