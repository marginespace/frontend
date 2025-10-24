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
          DEFAULT: '1.5rem',
          sm: '4rem',
          lg: '6rem',
          xl: '9.75rem',
          '2xl': '9.75rem',
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
          DEFAULT: 'hsl(var(--primary))',
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
        'light-purple': '#a093fe',
        'light-purple-hover': '#7f75cb',
        'light-grey': '#C6C6CC',
        'additional-grey': '#667085',
        text: '#293056',
        danger: '#D85F5A',
        'text-light': '#667085',
        'text-contrast': '#FFF094',
        'text-grey': '#F1F3F8',
        'text-purple': '#CFC9FF',
        'transparent-bg': 'rgba(255,255,255,0.11)',
        'transparent-bg-80': 'rgba(255,255,255,0.08)',
        'transparent-bg-dark': 'rgba(53,40,82,0.43)',
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
        'linear-transparent-white':
          'var(--bg-linear-transparent-white ,linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 50%, rgba(255,255,255,0.1) 100%))',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      boxShadow: {
        tab: '0 5px 0 rgba(255, 255, 255, 0.11)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        appear: 'appear .3s ease-out',
        success: 'success .3s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
