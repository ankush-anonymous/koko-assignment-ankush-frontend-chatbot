import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./standalone/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: '#vet-chatbot-widget-container',
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts
  },
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
