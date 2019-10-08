/* global describe, it, expect */
'use strict';

const Strategy = require('../lib/strategy');


describe('Strategy', () => {
  const strategy = new Strategy(() => {});

  it('should be named local', () => {
    expect(strategy.name).to.equal('local');
  });

  it('should throw if constructed without a verify callback', () => {
    expect(() => {
      Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
});
