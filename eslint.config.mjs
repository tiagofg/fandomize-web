import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Configuração para ordenar imports
    plugins: ["import"],
    rules: {
      // -- Import order --
      "import/order": [
        "error",
        {
          groups: [
            "builtin",            // node core modules
            "external",           // dependencies in node_modules
            "internal",           // paths aliasados do seu projeto
            ["parent", "sibling", "index"], // imports relativos
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // -- Sort members dentro do mesmo import --
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],

      // Sua configuração existente para jest.setup.js
      "@typescript-eslint/no-require-imports": "off",
    },
    files: ["jest.setup.js"],
  },
];

export default eslintConfig;
