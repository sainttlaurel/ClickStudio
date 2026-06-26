/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FDF5F7',
        surface: '#FFFFFF',
        card: '#FFF0F5',
        border: '#F5C5D8',
        primary: '#E91E8C',
        secondary: '#FF85A2',
        accent: '#FFB3C6',
        text: '#1C0B1A',
        muted: '#9B6B7B',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#EF4444',
        rose: {
          50: '#FFF0F5',
          100: '#FFE0EC',
          200: '#FFB3C6',
          300: '#FF85A2',
          400: '#FF5C8A',
          500: '#E91E8C',
          600: '#D01679',
          700: '#A80F5E',
          800: '#800A47',
          900: '#5A0631',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        script: ['Dancing Script', 'cursive'],
        display: ['DM Serif Display', 'serif'],
        cute: ['Quicksand', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        polaroid: '0.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        polaroid: '0 4px 20px rgba(233, 30, 140, 0.12)',
        sticker: '2px 3px 12px rgba(233, 30, 140, 0.18)',
        soft: '0 2px 20px rgba(233, 30, 140, 0.08)',
        glow: '0 0 30px rgba(233, 30, 140, 0.2)',
        card: '0 4px 32px rgba(28, 11, 26, 0.06)',
        nav: '0 2px 24px rgba(28, 11, 26, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        countdown: 'countdown 1s ease-in-out',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'pulse-pink': 'pulsePink 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        countdown: {
          '0%': { transform: 'scale(1.3)', opacity: '0' },
          '40%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.7)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--rot, 0deg))' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        pulsePink: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(233,30,140,0.3)' },
          '50%': { boxShadow: '0 0 0 12px rgba(233,30,140,0)' },
        },
      },
    },
  },
  plugins: [],
}
