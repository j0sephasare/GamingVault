/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind exactly which files to scan.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colours for the gaming aesthetic
      colors: {
        vault: {
          bg:       '#0d0f1a',   // deep navy — main background
          surface:  '#161929',   // slightly lighter — card background
          border:   '#252840',   // subtle card borders
          accent:   '#6366f1',   // indigo — primary action colour
          'accent-hover': '#4f52d4',
          muted:    '#9ca3af',   // grey text for labels
        }
      },
      fontFamily: {
       
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      }
    },
  },
  plugins: [],
}