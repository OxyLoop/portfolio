import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0A0A0A',
        ink: '#F5F5F5',
        muted: '#8A8A8A',
        /** Extra-dim technical text — e.g. the "STACK_" / "SOURCE_" prefix words. */
        subtle: '#666666',
        /** Solid approximation of rgba(255,255,255,0.08) over canvas — kept
         *  as a solid hex so Tailwind's /NN opacity modifiers (used on
         *  several existing border-line/NN usages) keep working correctly. */
        line: '#1F1F1F',
        night: '#111111',
        fog: '#151515',
        /** Restrained terminal-green accent — use sparingly (links, active
         *  states, tiny status indicators), never as a dominant color. */
        accent: '#7CFF9B',
      },
      fontFamily: {
        sans: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-editorial)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 12vw, 11rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 7vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        container: '1600px',
      },
    },
  },
  plugins: [],
};

export default config;
