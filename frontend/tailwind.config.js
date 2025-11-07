/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          50: '#f5f9ff',
          100: '#e6f0ff',
          300: '#9cc4ff',
          500: '#2b6cb0',
          700: '#114b7a',
        },
        'brand-yellow': {
          50: '#fffaf0',
          100: '#fff3d6',
          300: '#ffd66a',
          500: '#ffb703',
          700: '#b27a00',
        },
        'brand-white': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
    },
  },
  plugins: [],
}

