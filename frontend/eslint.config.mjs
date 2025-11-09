import { defineConfig } from '@fullstacksjs/eslint-config';

export default defineConfig({
  typescript: true,
  rules: {
    // Console and debugging
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error',

    // Code length and complexity
    'max-lines': [
      'error',
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-lines-per-function': [
      'error',
      {
        max: 100,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    'max-depth': ['error', 4],
    'max-params': ['error', 4],
    complexity: ['error', 10],
    'max-nested-callbacks': ['error', 3],
    'max-statements': ['error', 15],

    // Line length
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      },
    ],

    // React specific
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-max-depth': ['error', { max: 5 }],
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',

    // Best practices
    'no-magic-numbers': [
      'warn',
      {
        ignore: [-1, 0, 1, 2, 10, 100, 1000],
        ignoreArrayIndexes: true,
      },
    ],
    'no-else-return': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
  },
});
