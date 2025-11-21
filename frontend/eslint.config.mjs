import { defineConfig } from '@fullstacksjs/eslint-config';

export default defineConfig({
  typescript: true,
  next: true,
  prettier: true,
  tailwind: { entryPoint: './app/globals.css' },
  disableExpensiveRules: process.env.NODE_ENV === 'development',
  rules: {
    'no-console': 'warn',
    'max-lines': [
      'warn',
      { max: 150, skipBlankLines: true, skipComments: true },
    ],
  },
});
