import {expect} from './bootstrap/node.js';
import {lookup} from '../lib/utils.js';

describe('utils', () => {
  describe('lookup', () => {
    it('should look up a nested field', () => {
      expect(lookup({user: {username: 'johndoe'}}, 'user[username]'))
        .to.equal('johndoe');
    });

    it('should return null for a null intermediate value', () => {
      expect(lookup({user: null}, 'user[username]')).to.be.null;
    });

    it('should return null for an undefined intermediate value', () => {
      expect(lookup({user: undefined}, 'user[username]')).to.be.null;
    });

    it('should not look up inherited fields', () => {
      expect(lookup({}, 'toString')).to.be.null;
    });

    for (const field of ['__proto__', 'constructor', 'prototype']) {
      it(`should not look up ${field}`, () => {
        expect(lookup({[field]: 'unsafe'}, field)).to.be.null;
      });
    }
  });
});
