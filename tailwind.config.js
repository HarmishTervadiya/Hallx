/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js, jsx, ts, tsx}", "./components/**/.{js, jsx, ts, tsz}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

