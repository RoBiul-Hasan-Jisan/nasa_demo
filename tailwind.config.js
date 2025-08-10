// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "rotate-slow": "rotate360 20s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        rotate360: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px 4px rgba(239,68,68, 0.6)" },
          "50%": { boxShadow: "0 0 18px 8px rgba(239,68,68, 1)" },
        },
      },
    },
  },
  plugins: [],
};
