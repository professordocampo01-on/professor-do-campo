module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pdoc_black: '#000000',
        pdoc_black2: '#050509',
        pdoc_gold: '#FFD700',
        pdoc_gold2: '#FFB800',
        neon_accent: '#7CFC00'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
