/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // ————— COLORES PRIMARIOS —————
        primary: {
          light: "#EFEAD8", // crema claro
          muted: "#A49674", // topo grisáceo
          DEFAULT: "#A81109", // rojo de marca
          dark: "#000000", // negro puro
        },

        // ————— COLORES SECUNDARIOS —————
        secondary: {
          lightest: "#F9F7F2", // off-white
          light: "#7F695D", // marrón claro
          accent: "#E51E1F", // rojo vivo
          dark: "#842020", // rojo oscuro
          darkest: "#2A2728", // gris antracita
        },

        backgroundImage: {
          "paper-pattern": "url('/assets/pattern-crema.svg')",
        },
        fontFamily: {
          heading: ["Montserrat", "sans-serif"],
          body: ["Poppins", "sans-serif"],
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}