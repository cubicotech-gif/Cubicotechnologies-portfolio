import type { Config } from "tailwindcss";

/**
 * Theme lives here and in globals.css as CSS variables.
 * Components reference semantic names (ink, muted, brand, accent, line, surface)
 * so a future retheme is a change to these two files, not to every page.
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      colors: {
        // Deep navy — headings and dark sections
        navy: {
          50: '#f2f6fc',
          100: '#e3ecf8',
          200: '#c6d9f1',
          300: '#96bae4',
          400: '#5f95d3',
          500: '#3a76bd',
          600: '#295ca0',
          700: '#224a82',
          800: '#1c3c69',
          900: '#17315f',
          950: '#102a5c',
        },
        // Primary action blue
        brand: {
          50: '#eff5ff',
          100: '#dbe8fe',
          200: '#bfd7fe',
          300: '#93bbfd',
          400: '#6095fa',
          500: '#3b76f6',
          600: '#2563eb',
          700: '#1d4fd8',
          800: '#1e41af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Warm highlight — play buttons, emphasis, progress
        accent: {
          50: '#fffaeb',
          100: '#fef1c7',
          200: '#fde389',
          300: '#f6c945',
          400: '#fab725',
          500: '#f49b0b',
          600: '#d87506',
          700: '#b35309',
          800: '#91410e',
          900: '#78360f',
        },
        // Semantic aliases
        ink: '#17315f',
        muted: '#5d6f8e',
        line: '#dce7f4',
        // Soft tint used for section backgrounds; keeps a scale so
        // gradients (sky-400, sky-500) still resolve.
        sky: {
          DEFAULT: '#e8f6ff',
          50: '#f3faff',
          100: '#e8f6ff',
          200: '#d0ecff',
          300: '#a7dcff',
          400: '#6cc5fb',
          500: '#38aaf1',
          600: '#1f8ad0',
          700: '#1a6da8',
          800: '#1c5b8a',
          900: '#1c4c72',
        },
        surface: '#ffffff',
        canvas: '#f7fbff',
      },
      boxShadow: {
        card: '0 4px 16px rgba(23, 49, 95, 0.06)',
        lift: '0 16px 32px rgba(25, 71, 141, 0.13)',
        stage: '0 25px 55px rgba(15, 42, 92, 0.22)',
        hero: '0 28px 65px rgba(23, 49, 95, 0.16)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'floaty': 'floaty 4.5s ease-in-out infinite',
        'floaty-slow': 'floaty 6s ease-in-out infinite reverse',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
