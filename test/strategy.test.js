'use strict';

const Strategy = require('../lib/strategy.js');

describe('Strategy', function () {
  const strategy = new Strategy(() => {
    // empty function
  });

  it('should be named local', () => {
    expect(strategy.name).to.equal('local');
  });

  it('should throw if constructed without a verify callback', () => {
    expect(() => {
      // eslint-disable-next-line no-new -- Deliberately testing that it throws
      /* const s = */ new Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
});
