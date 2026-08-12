'use strict';

// eslint-disable-next-line no-undef -- JSDoc requires .js despite being CJS
module.exports = {
  recurseDepth: 10,
  source: {
    exclude: [
      'node_modules',
      'dist',
      'var',
      'coverage',
      'test'
    ]
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: false
  },
  templates: {
    cleverLinks: true,
    monospaceLinks: false
  },
  opts: {
    recurse: true,
    verbose: true,
    destination: 'docs/jsdoc'
  }
};
