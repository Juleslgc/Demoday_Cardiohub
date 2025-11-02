// eslint.config.js
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

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
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    plugins: { jest: jestPlugin },
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
    },
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
        jest: true,
      },
    },
  },
];
