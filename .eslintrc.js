/*
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'error',
    'react/self-closing-comp': 'warn',
  },
}
