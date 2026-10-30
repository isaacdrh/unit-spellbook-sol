import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      // Complexity guardrails
      complexity: ["warn", { max: 10 }],
      "max-depth": ["warn", 3],
      "max-lines-per-function": [
        "warn",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      "max-params": ["error", 3],

      // Code good practice
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",

      // Added in Part A
      "no-template-curly-in-string": "warn",
      "id-length": ["warn", { min: 3 }],
      "no-magic-numbers": ["warn", { ignore: [0, 1] }],

      // Prevent Code Smells
      "no-param-reassign": "error",
      "no-shadow": "error",
      "prefer-template": "error",

      // User interface
      "no-alert": "error",
    },
  },
  {
    files: ["src/tests/**"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
]);
