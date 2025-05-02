/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {

        neutral: {
          50:  "#FBF7F0", 
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

        brand: {
          green: {
            DEFAULT: "#869F72",
            light:   "#A3B78E",  
            dark:    "#6C7E52",  
          }
        },

        accent: {
          coral: {
            DEFAULT: "#D1633B",
            light:   "#E08A67",
            dark:    "#A34820",
          }
        },

        leaf: {
          DEFAULT: "#75905B",
          light:   "#95AB7E",
          dark:    "#4E673D",
        },
      },

      backgroundImage: {
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
  ],
}
