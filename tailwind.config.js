/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Background suave tipo crema
        neutral: {
          50:  "#FBF7F0",  // very light cream
          100: "#F3EDE1",
          200: "#E5DAC3",
          300: "#D7C8A5",
          400: "#C9B687",
          500: "#BBA469",
          600: "#A3915C",
          700: "#8B7750",
          800: "#6E5B3F",
          900: "#51422F",
        },

        // Verde principal (letra R/M)
        brand: {
          green: {
            DEFAULT: "#869F72",
            light:   "#A3B78E",  // tint más suave
            dark:    "#6C7E52",  // tono más profundo
          }
        },

        // Coral / terracota (rosa y texto)
        accent: {
          coral: {
            DEFAULT: "#D1633B",
            light:   "#E08A67",
            dark:    "#A34820",
          }
        },

        // Detalle secundario (hojas del tallo)
        leaf: {
          DEFAULT: "#75905B",
          light:   "#95AB7E",
          dark:    "#4E673D",
        },
      },

      backgroundImage: {
        // si quieres un fondo texturizado muy suave
        "paper-pattern": "url('/assets/pattern-crema.svg')",
      },

      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body:    ["Poppins",    "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
}
