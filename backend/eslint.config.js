// eslint.config.js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: true,
        __dirname: true,
        console: true,
        module: true,
      },
    },
    rules: {
      "no-unused-vars": ["warn"],
      "no-undef": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "no-console": "off"
    },
  },
];
