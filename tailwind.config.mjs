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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            hyphens: 'auto',
            p: {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            },
            code: {
              backgroundColor: '#f0f0f0',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              overflowWrap: 'break-word',
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            pre: {
              backgroundColor: '#f0f0f0',
              padding: '1em',
              borderRadius: '0.5rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              code: {
                backgroundColor: 'transparent',
                padding: 0,
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
              }
            }
          }
        },
        invert: {
          css: {
            code: {
              backgroundColor: '#2d2d2d',
            },
            pre: {
              backgroundColor: '#2d2d2d',
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  important: true, // This ensures Tailwind classes take precedence over MUI styles
} 