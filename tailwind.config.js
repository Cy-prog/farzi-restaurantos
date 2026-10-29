/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          975: '#07080A',
          950: '#0B0D12',
          900: '#11141C',
          850: '#171B26',
          800: '#1F2432',
          700: '#2C3345',
          600: '#3D465C',
          500: '#56617C',
        },
        charcoal: {
          975: '#07080A',
          950: '#0B0D12',
          900: '#11141C',
          850: '#171B26',
          800: '#1F2432',
          700: '#2C3345',
          600: '#3D465C',
          500: '#56617C',
        },
        saffron: {
          300: '#F5C86E',
          400: '#EEB446',
          500: '#E09F27',
          600: '#C28216',
          700: '#9B640D',
        },
        terracotta: {
          300: '#F0815E',
          400: '#E66138',
          500: '#D44A1E',
          600: '#B0350F',
          700: '#882407',
        },
        brass: {
          300: '#D8B88C',
          400: '#C59F6D',
          500: '#A8814F',
          600: '#8A6436',
          700: '#694922',
        },
        gold: {
          200: '#FBF2D5',
          300: '#F5E09E',
          400: '#EEB446',
          500: '#DDA027',
          600: '#B87E14',
          700: '#8E5E0B',
          800: '#5F3D05',
        },
        copper: {
          300: '#E8B39B',
          400: '#D79678',
          500: '#BF7854',
          600: '#9C5B39',
          700: '#754024',
        },
        sage: {
          400: '#6B8576',
          500: '#506B5C',
          600: '#3A5043',
        },
        parchment: {
          50: '#FAF8F5',
          100: '#F4F0E8',
          200: '#E8E1D3',
          300: '#D5CCBB',
          400: '#A9A08F',
          500: '#7B7364',
        },
        ivory: {
          50: '#FAF8F5',
          100: '#F4F0E8',
          200: '#E8E1D3',
          300: '#D5CCBB',
          400: '#A9A08F',
          500: '#7B7364',
        }
      },
      fontFamily: {
        display: ['"Syne"', '"Cinzel"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace', 'ui-monospace'],
      },
      boxShadow: {
        'editorial': '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        'subtle-line': '0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glow-saffron': '0 0 35px -5px rgba(224, 159, 39, 0.25)',
        'glow-terracotta': '0 0 35px -5px rgba(212, 74, 30, 0.3)',
      },
      letterSpacing: {
        'super-wide': '0.35em',
        'mega-wide': '0.5em',
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'marquee-reverse': 'marqueeReverse 28s linear infinite',
        'marquee-fast': 'marquee 16s linear infinite',
        'spin-slow': 'spin 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
