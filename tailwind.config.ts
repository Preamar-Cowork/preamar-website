import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pm: {
          bg: "#F3F1EC",
          bgAlt: "#EAE7DF",
          ink: "#3F4346",
          graphite: "#6E7275",
          line: "#DAD5CB",
          sky: "#84A6B2",
          concrete: "#7B8083",
          sapal: "#6E7A5E",
          slate: "#5C6670",
          cream: "#F3F1EC",
        },
      },
      fontFamily: {
        display: ["var(--font-caslon-display)", "serif"],
        body: ["var(--font-caslon-text)", "serif"],
        label: ["var(--font-archivo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
