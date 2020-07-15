const path = require("path");
const { join } = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    darkSelector: ".dark",
    extend: {
      colors: {
        black: "#000",
        white: "#fff",
        transparent: "transparent",
        gray: {
          100: "#fafafa",
          150: "#efefef",
          200: "#eaeaea",
          300: "#999",
          400: "#888",
          500: "#666",
          600: "#444",
          700: "#333",
          750: "#222",
          800: "#111",
        },
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      backgroundOpacity: {
        85: "0.85",
      },
    },
  },
  variants: {
    cursor: ["disabled", "hover", "focus", "active"],
    opacity: ["disabled", "hover", "focus", "active"],
    backgroundOpacity: [
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
    ],
    borderColor: [
      "dark",
      "dark-focus",
      "dark-active",
      "dark-disabled",
      "dark-hover",
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
      "disabled",
    ],
    backgroundColor: [
      "dark",
      "dark-focus",
      "dark-active",
      "dark-disabled",
      "dark-hover",
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
      "disabled",
    ],
    textColor: [
      "dark",
      "dark-focus",
      "dark-active",
      "dark-disabled",
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
      "disabled",
    ],
    boxShadow: [
      "dark",
      "dark-disabled",
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
      "disabled",
    ],
    scale: ["responsive", "hover", "focus", "active", "group-hover"],
    height: ["first", "responsive", "hover", "focus", "active", "group-hover"],
    width: ["first", "responsive", "hover", "focus", "active", "group-hover"],
    placeholderColor: [
      "dark-placeholder",
      "responsive",
      "hover",
      "focus",
      "active",
      "group-hover",
    ],
  },
  purge: {
    enabled: process.env.NODE_ENV === "PRODUCTION",
    content: [
      join(__dirname, "node_modules", "@reactants", "ui", "dist", "**", "*.js"),
      join(__dirname, "pages", "**", "*.tsx"),
    ],
    options: { whitelist: ["dark"] },
  },
  plugins: [
    require("tailwindcss-theming")({
      themes: path.join(
        __dirname,
        "node_modules",
        "@reactants",
        "ui",
        "scripts",
        "theme.config.js"
      ),
      strategy: "class",
    }),
    require("tailwindcss-dark-mode")(),
    require("@tailwindcss/ui"),
  ],
};
