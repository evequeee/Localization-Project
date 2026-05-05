/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        p4yellow: '#FADB00',
        p4black: '#121212',
        p4gray: '#2A2A2A',
      },
    },
  },
  plugins: [],
}