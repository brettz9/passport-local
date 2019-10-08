/* global describe, it, expect, before */
/* jshint expr: true */
'use strict';

const chai = require('chai');
const Strategy = require('../lib/strategy');

chai.use(require('@passport-next/chai-passport-strategy'));

describe('Strategy', () => {
  describe('passing request to verify callback', () => {
    const strategy = new Strategy({ passReqToCallback: true },
      (req, username, password, done) => {
        if (username === 'johndoe' && password === 'secret') {
          return done(null, { id: '1234' }, { scope: 'read', foo: req.headers['x-foo'] });
        }
        return done(null, false);
      });

    let user,
      info;

    before((done) => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u;
          info = i;
          done();
        })
        .req((req) => {
          req.headers['x-foo'] = 'hello';

          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should supply user', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(info).to.be.an('object');
      expect(info.scope).to.equal('read');
    });

    it('should supply request header in info', () => {
      expect(info.foo).to.equal('hello');
    });
  });
});
