import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import globals from "globals";

export default tseslint.config(eslint.configs.recommended, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.mocha,
    },
  },
});
