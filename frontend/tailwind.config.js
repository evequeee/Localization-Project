/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Persona 4 Golden / Midnight Channel Palette - Enhanced Depth
        'p4-bg': '#121212',            // Darkest base (body bg)
        'p4-white': '#ffffff',         // Pure white for text
        'p4-yellow': '#ffd700',        // Persona 4 Golden Yellow
        'p4-accent': '#ffeb3b',        // Bright accent yellow
        'p4-dark': '#1e1e1e',          // Card background (slightly lighter than bg)
        'p4-gray': '#262626',          // Placeholder/info box bg
        'p4-border': '#1a1a1d',        // Border color
        'p4-light-gray': '#333333',    // Lighter gray for secondary elements
        // Legacy colors (kept for compatibility)
        p4yellow: '#FADB00',
        p4black: '#121212',
        p4gray: '#2A2A2A',
      },
      skew: {
        'accent-6': '-6deg',
        'accent-8': '-8deg',
        'accent-y-2': '2deg',
        'accent-y-3': '3deg',
      },
      animation: {
        'menu-hover': 'menuHover 0.2s ease-out forwards',
        'card-bounce': 'cardBounce 0.3s ease-out forwards',
        'pulse-yellow': 'pulseYellow 0.4s ease-out',
        'skew-in': 'skewIn 0.25s ease-out',
        'slide-x': 'slideX 0.2s ease-out forwards',
        'scanlines': 'scanlines 0.15s linear infinite',
      },
      keyframes: {
        menuHover: {
          'from': {
            'transform': 'translateX(0) skewX(-6deg)',
            'color': 'white',
          },
          'to': {
            'transform': 'translateX(12px) skewX(-8deg)',
            'color': '#ffd700',
          }
        },
        cardBounce: {
          'from': {
            'transform': 'translateY(0) scale(1)',
          },
          'to': {
            'transform': 'translateY(-8px) scale(1.02)',
          }
        },
        pulseYellow: {
          'from': {
            'box-shadow': '0 0 0 0 rgba(255, 215, 0, 0.7)',
          },
          'to': {
            'box-shadow': '0 0 0 10px rgba(255, 215, 0, 0)',
          }
        },
        skewIn: {
          'from': {
            'transform': 'skewX(0deg) opacity(0)',
          },
          'to': {
            'transform': 'skewX(-6deg) opacity(1)',
          }
        },
        slideX: {
          'from': {
            'transform': 'translateX(-100%) skewX(6deg)',
          },
          'to': {
            'transform': 'translateX(0) skewX(-6deg)',
          }
        },
        scanlines: {
          'from': {
            'transform': 'translateY(0)',
          },
          'to': {
            'transform': 'translateY(4px)',
          }
        }
      },
      boxShadow: {
        'p4': '4px 4px 0px 0px rgba(255, 215, 0, 1)',
        'p4-lg': '6px 6px 0px 0px rgba(255, 215, 0, 1)',
        'p4-xl': '8px 8px 0px 0px rgba(255, 215, 0, 1)',
        'p4-black': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'p4-black-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
      },
      transitionTimingFunction: {
        'p4': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}