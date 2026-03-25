// TODO: #84569 #111452 remove this file when @ndwnu/eslint-config beta.6 is released
// Mirrors @ndwnu/eslint-config eslint.config.cjs (beta.5) using individual packages

const angularEslintPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const tsEslint = require('typescript-eslint');

module.exports = [
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tsEslint.configs.recommended.reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
      ...tsEslint.configs.stylistic.reduce((acc, c) => ({ ...acc, ...c.rules }), {}),
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component'] }],
      '@angular-eslint/component-selector': ['error', { type: 'element', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', style: 'camelCase' }],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: ['enum', 'enumMember', 'interface', 'typeParameter'], format: ['PascalCase'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'variable', modifiers: ['const'], format: ['camelCase'] },
        { selector: 'variable', modifiers: ['global'], format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      '@typescript-eslint/no-use-before-define': ['warn', { functions: false, classes: false, variables: true }],
      'eol-last': ['error', 'always'],
      'max-lines': ['error', { max: 250 }],
      'no-multiple-empty-lines': 'error',
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'class' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'block-like', next: ['let', 'const'] },
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
  },
  {
    files: ['src/**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      ...angularTemplatePlugin.configs['recommended'].rules,
      ...angularTemplatePlugin.configs['accessibility'].rules,
    },
  },
];
