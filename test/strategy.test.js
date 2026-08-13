import {expect} from './bootstrap/node.js';

import Strategy from '../lib/index.js';

/** @import {StrategyLike} from '@passport-next/chai-passport-strategy' */

describe('Strategy', function () {
  /** @satisfies {StrategyLike} */
  const strategy = new Strategy(() => {
    // empty function
  });

  it('should be named local', () => {
    expect(strategy.name).to.equal('local');
  });

  it('should throw if constructed without a verify callback', () => {
    expect(() => {
      // @ts-expect-error -- Bad argument
      // eslint-disable-next-line no-new -- Deliberately testing that it throws
      /* const s = */ new Strategy();
    }).to.throw(TypeError, 'LocalStrategy requires a verify callback');
  });
});
