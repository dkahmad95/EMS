/** @type {import('tailwindcss').Config} */
const t = require('./app/theme/tokens');

const px = (n) => `${n}px`;

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    // Hover styles only on devices that can hover (no sticky hover on touch).
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        /* Brand (green). The only color for primary actions, selection, focus. */
        primary: t.primary,
        /* Supporting hue for KPI accents and charts only. */
        secondary: t.secondary,
        accent: t.accent,
        success: t.success,
        warning: t.warning,
        danger: t.danger,
      },

      boxShadow: {
        card: t.shadow.card,
        'card-hover': t.shadow.cardHover,
        dropdown: t.shadow.dropdown,
        modal: t.shadow.modal,
      },

      backgroundImage: {
        'gradient-primary': `linear-gradient(135deg, ${t.primary[600]} 0%, ${t.primary[700]} 100%)`,
        'sidebar-brand': `linear-gradient(135deg, ${t.primary[600]} 0%, ${t.primary[700]} 100%)`,
      },

      borderRadius: {
        md: px(t.radius.md),
        lg: px(t.radius.lg),
        xl: px(t.radius.xl),
        '2xl': px(t.radius['2xl']),
      },

      transitionTimingFunction: {
        out: t.easing.enter,
        in: t.easing.exit,
      },

      transitionDuration: {
        fast: `${t.duration.fast}ms`,
        base: `${t.duration.base}ms`,
        slow: `${t.duration.slow}ms`,
      },

      animation: {
        'fade-in': `fadeIn ${t.duration.base}ms ${t.easing.enter}`,
        'slide-up': `slideUp ${t.duration.base}ms ${t.easing.enter}`,
        'scale-in': `scaleIn ${t.duration.base}ms ${t.easing.enter}`,
        shimmer: 'shimmer 1.6s infinite linear',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      fontFamily: {
        sans: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
