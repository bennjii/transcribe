module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./public/components/**/*.{js,ts,jsx,tsx}",
    "./public/components/**/**/*.{js,ts,jsx,tsx}",
    "./public/components/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        'text-lg': "1rem"
      }
    },
    fontFamily: {
      'psans': ['Public Sans']
    },
    colors: {
      borderDefault: "#1f1d2417",
      accentTextColor: "#597298",
      accentBgColor: "#c5d3ea83",
      accentRGB: "89, 114, 152",
      accentShadowColor: "#b6c0d01f",
      accentPageBg: "#e7ebffa6",
      highlightColor: "#f5deb3",
      textColor: "#131214",
      textMuted: "#535557",
      textInactive: "#929296",
      highlightColor2: "#dfe5ff",
      headerPrimary: "#131214",
      headerSecondary: "#9aa3af",
      textNormal: "#131214",
      textMuted: "#535557",
      textLink: "#00b0f4",
      textPositive: "#4fdc7b",
      textNegative: "#ff7878"
    }
  },
  plugins: [],
}
