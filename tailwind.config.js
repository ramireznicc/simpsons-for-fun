/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        simpsonYellow: "#FED41D",
        simpsonSky: "#6DB9D8",
        simpsonCream: "#FFFEF7",
        simpsonOrange: "#FF8C00",
        simpsonRed: "#E63946",
        simpsonGreen: "#06D6A0",
      },
      fontFamily: {
        sans: ["'Poppins'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
