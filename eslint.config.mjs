import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["main.js", "node_modules/"],
  },
  ...obsidianmd.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.mjs", "scripts/*.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["*.mjs", "scripts/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "obsidianmd/no-nodejs-modules": "off",
    },
  },
  {
    files: ["src/settings.ts"],
    rules: {
      "@typescript-eslint/no-deprecated": "off",
    },
  },
]);
