/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B1220',      /* Deep Navy Main */
          card: '#0F172A',    /* Slate 900 */
          edge: '#020617',    /* Slate 950 Footer/Nav */
          primary: '#2563EB', /* Trusty Blue */
          primaryHover: '#1D4ED8',
          text: '#E5E7EB',    /* Gray 200 */
          muted: '#94A3B8',   /* Slate 400 */
          border: '#1E293B',  /* Slate 800 */
          success: '#22C55E',
          warning: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}