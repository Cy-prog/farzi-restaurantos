/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0A0B0E',
          900: '#12141A',
          850: '#171922',
          800: '#1E222D',
          700: '#2A2F3D',
          600: '#3A4153',
        },
        gold: {
          300: '#F3D985',
          400: '#E5C358',
          500: '#D4AF37',
          600: '#B89225',
          700: '#8C6C16',
        },
        copper: {
          400: '#D9946E',
          500: '#C57D56',
          600: '#A9643F',
        },
        ivory: {
          50: '#FAF8F5',
          100: '#F3EFE6',
          200: '#E8E1D3',
          300: '#D4CAB7',
          400: '#A89E8C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
