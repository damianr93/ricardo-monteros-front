export default {
  plugins: {
    // Plugin de nesting propio de Tailwind, antes de tailwindcss, para procesar
    // el CSS anidado (p. ej. el de Swiper) y evitar el warning de PostCSS.
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  }
}