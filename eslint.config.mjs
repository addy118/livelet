import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["node_modules", ".next", "dist"],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
  ),

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // disallow var keyword
      "no-var": "warn",

      // only warn on unused var
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],

      // // disallow imports from server files into client files
      // "no-restricted-imports": [
      //   "error",
      //   {
      //     paths: [
      //       {
      //         name: "@/auth",
      //         message:
      //           "Do not import server-only logic (like `auth()`) into client components.",
      //       },
      //       {
      //         name: "@/lib/db",
      //         message:
      //           "Avoid importing Prisma DB client directly into client files.",
      //       },
      //     ],
      //   },
      // ],
    },
  },
];

export default eslintConfig;
