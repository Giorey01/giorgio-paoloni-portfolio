import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      colors: {
        'gallery-white': '#fdfdfd',
        'gallery-gray': '#f2f2f2',
        'gallery-dark': '#1a1a1a',
      },
      animation: {
        "scale-up-center":
          "scale-up-center 0.25s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both",
      },
      keyframes: {
        "scale-up-center": {
          "0%": {
            transform: "scale(.5)",
          },
          to: {
            transform: "scale(1)",
          },
        },
      },
    },
  },
};
export default config;
