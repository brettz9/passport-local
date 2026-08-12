import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'coverage/',
      'var/',
      'docs/jsdoc'
    ]
  },
  ...ashNazg(['sauron', 'node']),
  {
    rules: {
      '@stylistic/dot-location': ['error', 'property'],
      'jsdoc/no-defaults': 'off'
    }
  },
  {
    files: ['test/*.js'],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: ['**/*.md/*.js'],
    rules: {
      'func-names': 'off',
      'import/newline-after-import': 'off',
      'eol-last': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-vars': ['warn', {
        argsIgnorePattern: 'username|password|done|req'
      }],
      'padded-blocks': 'off',
      'import/unambiguous': 'off',
      'import/no-unresolved': 'off',
      'no-multi-spaces': 'off',
      strict: 'off',
      'no-useless-catch': 'off',
      'sonarjs/no-useless-catch': 'off',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-missing-require': [
        'error', {
          allowModules: [
            '@passport-next/passport',
            '@passport-next/passport-local',
            'body-parser'
          ]
        }
      ]
    }
  }
];
