/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF5F0',
          100: '#FFE6DB',
          200: '#FFD4C4',
          300: '#FFC2AE',
          400: '#FFAB8F',
          500: '#FF8C56',
          600: '#FF6B35',
          700: '#E85C2B',
          800: '#D14D21',
          900: '#B93E17',
        },
        primary: '#FF6B35',
        secondary: '#004E89',
        accent: '#F77F00',
      }
    },
  },
  plugins: [],
}
