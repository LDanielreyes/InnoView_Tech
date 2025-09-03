/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"], 
      },
      colors: {
        purple: {
          DEFAULT: "#4b217a", 
          600: "#3f1b6a",     
        },
        white: "#ffffff",
        text: "#00000",      
        muted: "#e7e3f6",   
        btn: "#ffffff",     
        "btn-text": "#3d2b7b" 
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
