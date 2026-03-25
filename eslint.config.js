// TODO: #84569 #111452 uncomment when beta.6 is released
// and remove @angular-eslint @typescript-eslint from package.json
// and delete eslint.ndwnu.config.js
// const baseConfig = require('@ndwnu/eslint-config/eslint.config.cjs');
const ndwnuConfig = require('./eslint.ndwnu.config.js');
const sonarConfig = require('./eslint.sonar.config.js');

module.exports = [
  {
    ignores: ['node_modules', 'dist', '.angular', 'projects/**/*', 'src/assets/**/*'],
  },
  // ...baseConfig,
  ...ndwnuConfig,
  ...sonarConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-inferrable-types': ['warn', { ignoreProperties: true }],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ber',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ber',
          style: 'camelCase',
        },
      ],
    },
  },
];
