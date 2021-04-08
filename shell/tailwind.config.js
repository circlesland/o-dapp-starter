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
    colors: {
      gradient1: "#00BFA9",
      gradient2: "#08568B",
      circlesblue: "#08568B",
      circlesdarkblue: "#032A45",
      circleshighlightblue: "#099BB0",
      linkgrey: "#97acbc",

      transparent: "transparent",
      current: "currentColor",
      blue: {
        light: "#85d7ff",
        DEFAULT: "#1fb6ff",
        dark: "#009eeb",
      },
      pink: {
        light: "#ff7ce5",
        DEFAULT: "#ff49db",
        dark: "#ff16d1",
      },
      gray: {
        darkest: "#1f2d3d",
        dark: "#3c4858",
        DEFAULT: "#c0ccda",
        light: "#e0e6ed",
        lightest: "#f9fafc",
      },
    },
    extend: {
      colors: require("daisyui/colors"),
      fontFamily: {
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
