module.exports = [
  {
    files: ['src/**/*.ts'],
    rules: {
      // S106: No console.log/warn/error/debug
      'no-console': [
        'warn',
        {
          allow: [
            'info',
            'table',
            'time',
            'timeEnd',
            'timeLog',
            'trace',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupCollapsed',
            'groupEnd',
          ],
        },
      ],
      // S121: Curly braces required on all control flow bodies
      curly: ['warn', 'all'],
      // S1105: Brace body must be on its own line
      'brace-style': 'warn',
      // S134: Max 3 levels of nested control flow
      'max-depth': ['warn', 3],
      // S1066: Merge collapsible nested if statements
      'no-lonely-if': 'warn',
      // S1117: No variable shadowing
      '@typescript-eslint/no-shadow': 'warn',
      // S2966: No non-null assertions (!)
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  {
    files: ['src/**/*.html'],
    rules: {
      // S6811: aria-required is not supported on role radio/checkbox
      '@angular-eslint/template/valid-aria': 'warn',
      // S6853: Labels must be associated with controls
      '@angular-eslint/template/label-has-associated-control': 'warn',
    },
  },
];
