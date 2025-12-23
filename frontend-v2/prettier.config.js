/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  arrowParens: "always",
  endOfLine: "lf",

  plugins: ["prettier-plugin-tailwindcss"],

  tailwindFunctions: ["clsx", "cn"],
  tailwindAttributes: ["className", "rootClass", "classNames"],
};

export default config;
