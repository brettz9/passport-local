import {expect} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

describe('passport-local', () => {
  it('should export Strategy constructor directly from package', () => {
    expect(Strategy).to.be.a('function');
  });
});
