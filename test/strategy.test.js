'use strict';
const Strategy = require('../lib/strategy');

describe('Strategy', function () {
  // eslint-disable-next-line no-empty-function
  const strategy = new Strategy(function () {});

  it('should be named local', function () {
    expect(strategy.name).to.equal('local');
  });

  it('should throw if constructed without a verify callback', function () {
    expect(function () {
      // eslint-disable-next-line no-unused-vars
      const s = new Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
});
