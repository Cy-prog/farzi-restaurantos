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
          975: '#060709',
          950: '#0A0B0E',
          900: '#12141A',
          850: '#171922',
          800: '#1E222D',
          700: '#2A2F3D',
          600: '#3A4153',
          500: '#525B72',
        },
        gold: {
          200: '#FAF0C2',
          300: '#F3D985',
          400: '#E5C358',
          500: '#D4AF37',
          600: '#B89225',
          700: '#8C6C16',
          800: '#5E480C',
        },
        copper: {
          300: '#E6AC8D',
          400: '#D9946E',
          500: '#C57D56',
          600: '#A9643F',
          700: '#844B2C',
        },
        terracotta: {
          400: '#F85C2C',
          500: '#E04A1B',
          600: '#B83811',
        },
        ivory: {
          50: '#FAF8F5',
          100: '#F3EFE6',
          200: '#E8E1D3',
          300: '#D4CAB7',
          400: '#A89E8C',
          500: '#7E7464',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'glow-gold-lg': '0 0 45px -8px rgba(212, 175, 55, 0.35)',
        'glow-copper': '0 0 30px -5px rgba(197, 125, 86, 0.25)',
        'card-luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.12)',
        'card-luxury-hover': '0 20px 45px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
        'radial-ambient': 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
        'gold-metallic': 'linear-gradient(135deg, #FAF8F5 0%, #D4AF37 50%, #C57D56 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
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
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
