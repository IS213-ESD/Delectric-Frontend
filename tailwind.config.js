/* eslint-env node */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    asideScrollbars: {
      light: 'light',
      gray: 'gray',
    },

    extend: {
      zIndex: {
        '-1': '-1',
      },
      flexGrow: {
        5: '5',
      },
      maxHeight: {
        'screen-menu': 'calc(100vh - 3.5rem)',
        modal: 'calc(100vh - 160px)',
      },
      transitionProperty: {
        position: 'right, left, top, bottom, margin, padding',
        textColor: 'color',
      },
      keyframes: {
        'fade-out': {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        'fade-out': 'fade-out 250ms ease-in-out',
        'fade-in': 'fade-in 250ms ease-in-out',
      },
      colors: {
        midnight: '#221E2F',
        red: {
          light: '#EE4B2B',
          DEFAULT: '#CC5500',
          dark: '#D22B2B',
        },
        green: {
          light: '#5BC9C4',
          DEFAULT: '#45ADA8',
          dark: '#329994',
        },
        blue: {
          light: '#ADD8E6',
          DEFAULT: '#0047AB',
          dark: '#00008B',
        },
        purple: {
          light: '#A3B3ED',
          DEFAULT: '#6580E1',
          dark: '#455DB3',
        },
        pink: {
          light: '#E3D1EC',
          DEFAULT: '#D0B2E0',
          dark: '#AC83C2',
        },
        main: {
          light: '#2D1577',
          DEFAULT: '#242343',
          dark: '#191835',
        },
        white: {
          light: '#94A3B8',
          DEFAULT: '#FFFFFF',
          dark: '#E2E8F0',
        },
        black: {
          light: '#343434',
          DEFAULT: '#000000',
          dark: '#28282B',
        },
        card: {
          light: '#332E46',
          DEFAULT: '#221E2F',
          dark: '#1B1826',
        },
        transparent: {
          light: 'rgba(255,255,255,0.3)',
          DEFAULT: 'rgba(255,255,255,0.2)',
          dark: '#FFFFFF1A',
        },
        gray: {
          light: '#f8fafc',
          DEFAULT: '#64748b',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'aside-scrollbars': (value) => {
            const track = value === 'light' ? '100' : '900';
            const thumb = value === 'light' ? '300' : '600';
            const color = value === 'light' ? 'gray' : value;

            return {
              scrollbarWidth: 'thin',
              scrollbarColor: `${theme(`colors.${color}.${thumb}`)} ${theme(
                `colors.${color}.${track}`
              )}`,
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme(`colors.${color}.${track}`),
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '0.25rem',
                backgroundColor: theme(`colors.${color}.${thumb}`),
              },
            };
          },
        },
        { values: theme('asideScrollbars') }
      );
    }),
  ],
};
