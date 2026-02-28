import migrate from "@oxlint/migrate";
import { type OxlintConfig, defineConfig } from "oxlint";

import eslintConfig from "./eslint.config.actual.js";

const removePlugin = [
  "@stylistic",
  "package-json",
  "format",
  "prettier",
  "functional", // Issue with type-aware rules
];

/* eslint-disable @typescript-eslint/no-dynamic-delete */
for (const config of eslintConfig) {
  // Remove all the plugins we have issues with.
  if (config.plugins !== undefined) {
    for (const plugin of removePlugin) {
      if (config.plugins[plugin] !== undefined) {
        delete config.plugins[plugin];
      }
    }
  }

  if (config.rules !== undefined) {
    for (const [key, value] of Object.entries(config.rules)) {
      // Remove turned off rules.
      if (
        value === "off" ||
        value === 0 ||
        (Array.isArray(value) && (value[0] === "off" || value[0] === 0))
      ) {
        delete config.rules[key];
      }

      // Remove rules of removed plugins.
      for (const plugin of removePlugin) {
        if (key.startsWith(`${plugin}/`)) {
          delete config.rules[key];
        }
      }
    }

    // Special handling for this rule.
    if (
      "@typescript-eslint/strict-boolean-expressions" in config.rules &&
      Array.isArray(config.rules["@typescript-eslint/strict-boolean-expressions"]) &&
      config.rules["@typescript-eslint/strict-boolean-expressions"].length > 1 &&
      typeof config.rules["@typescript-eslint/strict-boolean-expressions"][1] === "object" &&
      config.rules["@typescript-eslint/strict-boolean-expressions"][1] !== null &&
      "allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing" in
        config.rules["@typescript-eslint/strict-boolean-expressions"][1]
    ) {
      delete config.rules["@typescript-eslint/strict-boolean-expressions"][1]
        .allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing;
    }
  }
}
/* eslint-enable @typescript-eslint/no-dynamic-delete */

export default defineConfig(
  (await migrate(
    eslintConfig,
    {
      plugins: [
        "eslint",
        "typescript",
        "unicorn",
        "react",
        "nextjs",
        "oxc",
        "import",
        "jsdoc",
        "node",
        "promise",
        "jest",
        "vitest",
        "vue",
      ],
    },
    {
      merge: false,
      typeAware: true,
      jsPlugins: true,
      withNursery: false,
    },
  )) as OxlintConfig,
);
