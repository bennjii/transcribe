module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./public/components/**/*.{js,ts,jsx,tsx}",
    "./public/components/**/**/*.{js,ts,jsx,tsx}",
    "./public/components/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
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
      borderHover: "#717173",
      borderHoverLight: "#BAB8C2",
      borderDefaultDark: "#363636",

      accentTextColor: "#597298",
      accentTextColorDark: "#578cf5",
      accentBgColor: "#c5d3ea83",
      accentRGB: "89, 114, 152",
      accentShadowColor: "#b6c0d01f",
      accentPageBg: "#e7ebffa6",

      backgroundHover: "#393939",
      backgroundDark: "#2d2d2d",

      bgDark: "#242424",
      bgLight: "#F5F7F9",
      bgDarkDark: "#121212",

      highlightColor: "#f5deb3",

      textColor: "#101011",
      textColorDark: "#fff",
      textColorDarkMuted: "#7e7e7f",
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
