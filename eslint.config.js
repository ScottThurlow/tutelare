import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";

// Complexity rules are `warn`, not `error`: they feed the PR risk score
// (cognitive complexity is a HIGH-tier signal) rather than hard-blocking a merge.
// Correctness rules from the recommended sets stay as errors.
export default tseslint.config(
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "coverage/",
      "playwright-report/",
      "test-results/",
      "reports/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  sonarjs.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      complexity: ["warn", 10],
      "sonarjs/cognitive-complexity": ["warn", 15],
    },
  },
);
