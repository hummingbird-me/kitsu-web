// @ts-check
/* Globals */
import globals from 'globals';

/* Plugins */
import js from '@eslint/js';
import ts from 'typescript-eslint';
import i18next from 'eslint-plugin-i18next';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import vitest from '@vitest/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';

export default ts.config(
  {
    ignores: ['dist/', 'coverage/'],
  },

  js.configs.recommended,
  ...ts.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  reactPlugin.configs.flat.recommended,
  i18next.configs['flat/recommended'],
  prettierConfig,

  // Application files
  {
    plugins: {
      'react-hooks': hooksPlugin,
      vitest,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
          minimumDescriptionLength: 3,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'import-x/no-absolute-path': 'error',
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-duplicates': [
        'error',
        {
          'prefer-inline': true,
          considerQueryString: true,
        },
      ],
      'react/prop-types': 'off',
      'i18next/no-literal-string': [
        'error',
        {
          markupOnly: true,
          ignoreAttribute: [
            'path',
            'to',
            'displayMode',
            'role',
            'href',
            'autoComplete',
            'kind',
            'size',
          ],
          ignoreComponent: [
            'FormattedMessage',
            'FormattedDate',
            'HeaderSettings',
          ],
        },
      ],
    },
  },

  // Storybook and test files
  {
    files: ['*.{stories,test}.{js,jsx,ts,tsx}'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },

  // Just test files
  {
    files: ['*.test.{js,jsx,ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },

  // Node-based config files
  {
    files: ['**/*.config.{js,ts}'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2015,
      sourceType: 'commonjs',
    },
  },
);
