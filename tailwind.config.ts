import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      backdropBlur: {
        '2lg': '20px',
      },
      opacity: {
        11: '0.11',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      colors: {
        gray: {
          350: 'rgb(198, 198, 204)',
        },
        indigo: {
          350: 'rgba(160, 147, 254, 1)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#D46B30',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Цветовая схема Margin Space
        'primary-hover': '#B85A26',
        'light-grey': '#C6C6CC',
        'additional-grey': '#667085',
        'background-dark': '#222324',
        text: '#293056',
        danger: '#D85F5A',
        furnace: '#FFF094',
        'text-light': '#667085',
        'text-contrast': '#FFF094',
        'text-grey': '#F1F3F8',
        'text-purple': '#CFC9FF',
        'light-purple': 'rgba(160, 147, 254, 1)',
        'light-purple-hover': 'rgba(140, 127, 234, 1)',
        'transparent-bg': 'rgba(255,255,255,0.11)',
        'transparent-bg-80': 'rgba(255,255,255,0.08)',
        'transparent-bg-dark': 'rgba(34,35,36,0.43)',
        'transparent-bg-darkest': 'rgba(14,18,27,0.35)',
        'main-gradient-1': 'rgba(255,255,255,0.28)',
        'main-gradient-2': 'rgba(255,255,255,0.17)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      backgroundImage: {
        'linear-white':
          'var(--bg-linear-white, linear-gradient(181deg, rgba(255, 255, 255, 0.37) 1.19%, rgba(255, 255, 255, 0.00) 102.31%))',
        'linear-black':
          'linear-gradient(181.4deg, rgba(0, 0, 0, 0.1) 1.19%, rgba(0, 0, 0, 0) 102.31%)',
        'linear-transparent-white':
          'var(--bg-linear-transparent-white ,linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.1) 100%))',
        'gradient-orange':
          'linear-gradient(135deg, #D46B30 0%, #F59E0B 50%, #EF4444 100%)',
        'gradient-orange-subtle':
          'linear-gradient(180deg, rgba(212, 107, 48, 0.1) 0%, rgba(212, 107, 48, 0) 100%)',
        'gradient-orange-radial':
          'radial-gradient(circle, rgba(212, 107, 48, 0.2) 0%, transparent 70%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(212, 107, 48, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      boxShadow: {
        tab: '0 5px 0 rgba(255, 255, 255, 0.11)',
        'glow-orange': '0 0 20px rgba(212, 107, 48, 0.4)',
        'glow-orange-lg': '0 0 40px rgba(212, 107, 48, 0.6)',
        'card-elevated': '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(212, 107, 48, 0.1)',
        'hover-lift': '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 107, 48, 0.2)',
      },
      gridTemplateColumns: {
        lp: '1fr repeat(2, 125px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        appear: {
          from: { opacity: '0.6' },
          to: { opacity: '1' },
        },
        success: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-orange': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-orange': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 107, 48, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 107, 48, 0.8), 0 0 30px rgba(212, 107, 48, 0.4)' },
        },
        'stagger': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-to-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        appear: 'appear .3s ease-out',
        success: 'success .3s ease-in-out',
        'pulse-orange': 'pulse-orange 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'glow-orange': 'glow-orange 2s ease-in-out infinite',
        'stagger': 'stagger 0.4s ease-out',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-out-to-left': 'slide-out-to-left 0.3s ease-in',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
