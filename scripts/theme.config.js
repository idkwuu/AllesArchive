const { Theme, ThemeManager } = require("tailwindcss-theming/api");

const base = new Theme()
  .addColors({
    primary: "#23539e",
    danger: "#ff4d4d",
    success: "#28a745",
    warning: "#ffbc32",
  })
  .addOpacityVariant("15", 0.15, "primary")
  .addOpacityVariant("75", 0.75, "primary")
  .addOpacityVariant("85", 0.85, "primary")
  .addOpacityVariant("5", 0.05, "danger")
  .addOpacityVariant("15", 0.15, "danger")
  .addOpacityVariant("50", 0.5, "danger")
  .addOpacityVariant("75", 0.75, "danger")
  .addOpacityVariant("85", 0.85, "danger");

const dark = new Theme()
  .setName("dark")
  .targetable()
  .addColors({
    primary: "#2e6cd1",
    danger: "#ff4d4d",
    success: "#28a745",
    warning: "#ffbc32",
  })
  .addOpacityVariant("15", 0.15, "primary")
  .addOpacityVariant("75", 0.75, "primary")
  .addOpacityVariant("85", 0.85, "primary")
  .addOpacityVariant("5", 0.05, "danger")
  .addOpacityVariant("15", 0.15, "danger")
  .addOpacityVariant("15", 0.15, "danger")
  .addOpacityVariant("50", 0.5, "danger")
  .addOpacityVariant("75", 0.75, "danger")
  .addOpacityVariant("75", 0.75, "danger")
  .addOpacityVariant("85", 0.85, "danger");

module.exports = new ThemeManager().setDefaultTheme(base).addTheme(dark);
