import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import formatjs from 'eslint-plugin-formatjs';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/*

This file must be `.mjs` to allow `dbaeumer.vscode-eslint` to parse it without
an extraneous dev dependency being installed (`jiti`).

*/

export default defineConfig([
  // JavaScript
  {
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    ignores: [
      '**.gen.ts',
    ],
    plugins: {
      js,
    },
    extends: [
      'js/recommended',
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/material',
              message: 'Import specific components from `@mui/material/<Component>` (e.g. `@mui/material/Box`) instead of `@mui/material`.',
            },
          ],
          patterns: [],
        },
      ],
    },
  },

  // TypeScript
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // React
  {
    ...pluginReact.configs.flat['jsx-runtime'],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
        disallowTypeAnnotations: true,
      }],

      '@typescript-eslint/no-unused-vars': ['warn', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },

  // React Hooks
  reactHooks.configs.flat['recommended-latest'],

  // Import
  {
    ...importPlugin.flatConfigs.recommended,
    rules: {
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'parent',
          'sibling',
          'internal',
          'index',
        ],
        'distinctGroup': false,
        'pathGroupsExcludedImportTypes': ['builtin'],
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true,
        },
      }],
    },
  },

  // FormatJS
  // https://formatjs.github.io/docs/tooling/linter/
  {
    plugins: {
      formatjs,
    },
    rules: {
      'formatjs/enforce-id': ['error', {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
      }],
      'formatjs/enforce-placeholders': 'error',
      'formatjs/no-offset': 'error',
    },
  },

  // Code style
  // https://eslint.style/rules
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'comma-dangle': 'off',
      '@stylistic/comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'always-multiline',
        'enums': 'always-multiline',
        'generics': 'always-multiline',
        'tuples': 'always-multiline',
      }],

      'indent': 'off',
      '@stylistic/indent': ['error', 2, {
        flatTernaryExpressions: false,
        offsetTernaryExpressions: false,
        ignoredNodes: ['ConditionalExpression'],
      }],

      '@stylistic/jsx-quotes': ['error', 'prefer-double'],

      'semi': 'off',
      '@stylistic/semi': ['error', 'always'],

      'quotes': ['error', 'single'],
    },
  },
]);
