/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        linen: {
          50:  '#FDFBF7',
          100: '#F7F1E8',
          200: '#EDE3D0',
          300: '#DDD0B8',
          400: '#C4A962',
          500: '#D4B895',
          600: '#B8986A',
          700: '#8A6F42',
          800: '#5C4828',
          900: '#2C2418',
        },
        sage: {
          300: '#B8CCBA',
          400: '#8BA888',
          500: '#6B8F6D',
          600: '#4E7052',
        },
        ink: {
          50:  '#F0EEE9',
          800: '#1A1714',
          900: '#100E0C',
          950: '#0A0907',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        script:  ['"Caveat"', 'cursive'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'grain':       'grain 8s steps(10) infinite',
        'marquee':     'marquee 25s linear infinite',
        'fade-up':     'fadeUp 0.7s ease forwards',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float:      { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-16px)' } },
        grain:      { '0%,100%': { transform: 'translate(0,0)' }, '10%': { transform: 'translate(-2%,-3%)' }, '20%': { transform: 'translate(3%,1%)' }, '30%': { transform: 'translate(-1%,4%)' }, '40%': { transform: 'translate(4%,-2%)' }, '50%': { transform: 'translate(-3%,3%)' } },
        marquee:    { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-gold':  '0 0 20px rgba(196,169,98,0.35)',
        'glow-sage':  '0 0 20px rgba(107,143,109,0.3)',
        'glow-white': '0 0 30px rgba(253,251,247,0.15)',
        'card':       '0 4px 32px rgba(44,36,24,0.08)',
        'card-dark':  '0 4px 32px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
