const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: false,
  purge: {
    content: ["./src/**/*.svelte", "./src/**/*.css", "./public/*.html"],
    options: {
      safelist: [/data-theme$/],
    },
  },
  daisyui: {
    styled: true,
    themes: true,
    rtl: false,
  },

  theme: {
    extend: {
      // colors: require("daisyui/colors"),
      colors: {
        base: "#000000",
        "base-300": "#D1D5DB",
        red: "#e3342f",
        gradient1: "#00BFA9",
        gradient2: "#08568B",
        circlesblue: "#08568B",
        circlesdarkblue: "#032A45",
        circleshighlightblue: "#099BB0",
        linkgrey: "#97acbc",
        transactionpositive: "#32CD32",
        transactionnegative: "#DC143C",
      },
      fontFamily: {
        circles: ["Ostrich Sans Heavy", "sans"],
        primary: ["Now Alt Light", "sans-serif"],
        sans: ["Now Alt Light", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
