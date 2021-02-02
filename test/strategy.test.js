'use strict';
const Strategy = require('../lib/strategy');

describe('Strategy', function () {
  const strategy = new Strategy(function () {
    // empty function
  });

  it('should be named local', function () {
    expect(strategy.name).to.equal('local');
  });

  it('should throw if constructed without a verify callback', function () {
    expect(function () {
      // eslint-disable-next-line no-new -- Deliberately testing that it throws
      /* const s = */ new Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
});
