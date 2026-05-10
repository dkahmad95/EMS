/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary — Indigo */
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },

        /* Secondary — Violet */
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },

        /* Accent — Sky */
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },

        /* Success — Emerald */
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },

        /* Warning — Amber */
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },

        /* Danger — Rose */
        danger: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'dropdown': '0 10px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
        'modal': '0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
        'soft': '0 2px 8px rgba(0,0,0,0.04)',
        'soft-md': '0 4px 12px rgba(0,0,0,0.06)',
        'soft-lg': '0 8px 24px rgba(0,0,0,0.08)',
        'soft-xl': '0 12px 32px rgba(0,0,0,0.10)',
        'glow-primary': '0 0 20px rgba(79, 70, 229, 0.30)',
        'glow-secondary': '0 0 20px rgba(124, 58, 237, 0.30)',
        'glow-accent': '0 0 20px rgba(14, 165, 233, 0.30)',
      },

      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'sidebar-brand': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.6s infinite linear',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      fontFamily: {
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
