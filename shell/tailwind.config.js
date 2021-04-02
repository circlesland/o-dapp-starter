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
      colors: require("daisyui/colors"),
      fontFamily: {
        primary: ["Graphik", "sans-serif"],
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#333",
            strong: {
              fontWeight: "800",
            },
          },
        },
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
