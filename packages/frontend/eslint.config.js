import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: ["plugin:@typescript-eslint/recommended"],
  }
);
