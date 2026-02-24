import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'lib/**',
      '*.config.js',
      'karma.conf.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'react/forbid-prop-types': 'off',
      'react/prop-types': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.browser
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/no-find-dom-node': 'off',
      'react/no-deprecated': 'off',
      'react/no-render-return-value': 'off',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
];
