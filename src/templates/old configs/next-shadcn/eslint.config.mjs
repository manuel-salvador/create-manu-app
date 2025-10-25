import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  ...compat.plugins('prettier', 'import'),
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^(?:_|props$)' }],
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          printWidth: 100,
          trailingComma: 'none',
          singleQuote: true,
          bracketSpacing: true
        }
      ],
      'react/self-closing-comp': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'object', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after'
            }
          ],
          'newlines-between': 'always'
        }
      ]
    }
  }
];

export default eslintConfig;
