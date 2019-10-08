/* global describe, it, expect, before */
'use strict';

const chai = require('chai');
const Strategy = require('../lib/strategy');

chai.use(require('@passport-next/chai-passport-strategy'));

describe('Strategy', () => {
  describe('encountering an error during verification', () => {
    const strategy = new Strategy((username, password, done) => {
      done(new Error('something went wrong'));
    });

    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went wrong');
    });
  });

  describe('encountering an exception during verification', () => {
    const strategy = new Strategy(() => {
      throw new Error('something went horribly wrong');
    });

    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  });
});
