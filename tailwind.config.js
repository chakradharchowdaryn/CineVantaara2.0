/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cine: {
          black: '#070709',
          card: '#111217',
          cardHover: '#181920',
          border: '#22232E',
          gold: '#E5A93C',
          goldHover: '#F5BE58',
          red: '#E50914',
          accent: '#7928CA',
          director: {
            primary: '#9333EA',
            secondary: '#6B21A8',
            accent: '#C084FC',
            bg: '#0D0914'
          },
          producer: {
            primary: '#10B981',
            secondary: '#047857',
            accent: '#F59E0B',
            bg: '#05100B'
          },
          writer: {
            primary: '#BE123C',
            secondary: '#881337',
            accent: '#FDE68A',
            bg: '#12070A'
          },
          actor: {
            primary: '#F43F5E',
            secondary: '#BE185D',
            accent: '#FCD34D',
            bg: '#13080C'
          },
          cinematographer: {
            primary: '#0284C7',
            secondary: '#0369A1',
            accent: '#38BDF8',
            bg: '#060F18'
          },
          editor: {
            primary: '#06B6D4',
            secondary: '#0891B2',
            accent: '#A5F3FC',
            bg: '#061318'
          },
          music: {
            primary: '#8B5CF6',
            secondary: '#5B21B6',
            accent: '#FBBF24',
            bg: '#0B0918'
          },
          vfx: {
            primary: '#14B8A6',
            secondary: '#0D9488',
            accent: '#60A5FA',
            bg: '#041014'
          },
          makeup: {
            primary: '#FB7185',
            secondary: '#BE185D',
            accent: '#FDE047',
            bg: '#14080F'
          },
          costume: {
            primary: '#EA580C',
            secondary: '#9A3412',
            accent: '#FBBF24',
            bg: '#140A06'
          },
          art: {
            primary: '#F97316',
            secondary: '#C2410C',
            accent: '#FEF08A',
            bg: '#130B06'
          },
          sound: {
            primary: '#00F2FE',
            secondary: '#0369A1',
            accent: '#38BDF8',
            bg: '#050D18'
          }
        }
      },
      fontFamily: {
        cinematic: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel Decorative', 'Cinzel', 'serif']
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(229, 169, 60, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(147, 51, 234, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
      },
      animation: {
        'spotlight': 'spotlight 2s ease .75s 1 forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: 1, transform: 'translate(-50%,-40%) scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
