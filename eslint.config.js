import oxlint from 'eslint-plugin-oxlint';
import { createJiti } from "jiti";

import eslintConfig from "./eslint.config.actual.js";

const jiti = createJiti(import.meta.url);

/**
 * @type {import('./oxlint.config.ts').default}
 */
const oxlintConfig = jiti.import("./oxlint.config.ts", { default: true });

export default [
  ...eslintConfig,
  ...oxlint.buildFromOxlintConfig(oxlintConfig),
];
