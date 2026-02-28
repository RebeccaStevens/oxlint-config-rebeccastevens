// @ts-check
import rsEslint from "@rebeccastevens/eslint-config";

export default await rsEslint({
  autoRenamePlugins: false,
  projectRoot: import.meta.dirname,
  mode: "library",
  typescript: {
    unsafe: "off",
  },
  formatters: false,
  functional: "recommended",
  jsonc: true,
  markdown: false,
  stylistic: true,
  yaml: true,
});
