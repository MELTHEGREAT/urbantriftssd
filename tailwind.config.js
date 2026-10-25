/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: { 900: '#1d1f1e', 800: '#2a2d2b', 700: '#3a3e3b', 500: '#6b706c' },
        ivory: { 50: '#fbf9f4', 100: '#f4f0e6', 200: '#e8e2d3' },
        moss: { 600: '#4f6b57', 700: '#3f5846', 100: '#e1e9e0' },
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
