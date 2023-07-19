import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        'gray-424242': '#424242'
      }
    },
  },
  plugins: [],
} satisfies Config;
