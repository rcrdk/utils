// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: ['expo', 'prettier'],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['/dist/*', 'node_modules'],
    plugins: ['prettier', 'simple-import-sort'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
          endOfLine: 'auto',
        },
      ],
      'object-shorthand': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'arrow-parens': ['error', 'always'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parserOptions: {
          project: ['./tsconfig.json'],
        },
      },
    ],
  }
  