import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        typing: {
          '0%': { width: '0%', visibility: 'hidden' },
          '100%': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
          '100%': { borderColor: 'white' },
        },
      },
      animation: {
        typing: 'typing 2.5s steps(30) forwards, blink .7s step-end infinite',
      },
    },
  },
  plugins: [],
}

export default config
