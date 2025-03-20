/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          text: 'rgba(0, 0, 0, 0.87)',
          primary: '#1976d2',
          secondary: '#9c27b0',
        },
        dark: {
          background: '#121212',
          text: '#ffffff',
          primary: '#90caf9',
          secondary: '#ce93d8',
        },
      },
    },
  },
  plugins: [],
  important: true, // This ensures Tailwind classes take precedence over MUI styles
} 