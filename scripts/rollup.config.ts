import { join } from "path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import tailwind from "tailwindcss";
import cssnano from "cssnano";
import pkg from "../package.json";

export default {
  input: "./src/index.ts",
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "esm", sourcemap: true },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      plugins: [
        tailwind(join(__dirname, "tailwind.config.js")),
        autoprefixer,
        cssnano,
      ],
      extract: "index.css",
    }),
  ],
};
