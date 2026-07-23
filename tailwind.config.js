import forms from '@tailwindcss/forms';

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
          light: "#EFEAD8",
          muted: "#A49674",
          DEFAULT: "#A81109",
          dark: "#000000",
        },
        // ————— COLORES SECUNDARIOS —————
        secondary: {
          lightest: "#F9F7F2",
          light: "#7F695D",
          accent: "#E51E1F",
          dark: "#842020",
          darkest: "#2A2728",
        },
      },
      backgroundImage: {
        "paper-pattern": "url('/assets/pattern-crema.svg')",
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ["Poppins", "sans-serif"],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          // -50% = el ancho de una copia (hay dos copias idénticas), por eso el
          // reinicio es invisible y el texto que sale por la izquierda reaparece
          // por la derecha de forma continua.
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 70s linear infinite',
      },
    },
  },
  plugins: [forms],
}
