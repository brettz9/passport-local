/* global describe, it, expect */
'use strict';

const strategy = require('..');

describe('passport-local', () => {
  it('should export Strategy constructor directly from package', () => {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });
});
