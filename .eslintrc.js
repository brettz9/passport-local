'use strict';
module.exports = {
  extends: ['ash-nazg/sauron', 'plugin:node/recommended-script'],
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script'
  },
  settings: {
    polyfills: [
    ]
  },
  overrides: [
    {
      files: ['test/**'],
      extends: [
        'ash-nazg/sauron',
        'plugin:node/recommended-script',
        'plugin:chai-friendly/recommended'
      ],
      globals: {
        expect: 'readonly'
      },
      env: {mocha: true},
      rules: {
      }
    },
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown'
    },
    {
      files: '**/*.md/*.js',
      rules: {
        'eol-last': ['off'],
        'no-console': ['off'],
        'no-undef': ['off'],
        'no-unused-vars': ['warn'],
        'padded-blocks': ['off'],
        'import/unambiguous': ['off'],
        'import/no-unresolved': ['off'],
        'node/no-missing-import': ['off'],
        'no-multi-spaces': 'off',
        strict: 'off',
        'no-useless-catch': 'off',
        'sonarjs/no-useless-catch': 'off',
        'node/no-missing-require': [
          'error', {
            allowModules: [
              '@passport-next/passport',
              '@passport-next/passport-local',
              'body-parser'
            ]
          }
        ],
        // Disable until may fix https://github.com/gajus/eslint-plugin-jsdoc/issues/211
        indent: 'off'
      }
    }
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
    'import/no-commonjs': 'off',
    'import/unambiguous': 'off'
  }
};
