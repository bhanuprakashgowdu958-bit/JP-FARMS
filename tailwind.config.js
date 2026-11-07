/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f4f7f4',
          100: '#e5eee5',
          200: '#ccdecd',
          300: '#a5c6a7',
          400: '#75a679',
          500: '#518956',
          600: '#3e6f42',
          700: '#335836',
          800: '#2a472d',
          900: '#233b26',
          950: '#0f1f11',
        },
        amber: {
          gold: '#D97706',
          deep: '#B45309',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
