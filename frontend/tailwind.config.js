module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { navy: { DEFAULT: "#031a45", 800: "#06265f", 900: "#021236" }, brand: "#00a8ff", accent: "#ff9f2e" },
    fontFamily: { display: ["var(--font-display)", "sans-serif"], sans: ["var(--font-body)", "sans-serif"] },
  } },
  plugins: [],
};
