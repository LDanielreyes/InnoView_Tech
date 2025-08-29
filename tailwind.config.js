/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{html,js}" // detecta todos tus html y js dentro de app
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"], // tu fuente global
      },
      colors: {
        purple: {
          DEFAULT: "#4b217a", // fondo principal
          600: "#3f1b6a",     // hover más oscuro
        },
        white: "#ffffff",
        text: "#ffffff",      // texto principal
        muted: "#e7e3f6",     // gris clarito
        btn: "#ffffff",       // fondo de botones
        "btn-text": "#3d2b7b" // texto de botones
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.25)",
        card: "0 6px 15px rgba(0,0,0,0.08)",
        cardHover: "0 8px 20px rgba(0,0,0,0.15)",
      }
    },
  },
  plugins: [],
}
