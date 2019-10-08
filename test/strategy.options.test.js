/* global describe, it, expect, before */
/* jshint expr: true */
'use strict';

const chai = require('chai');
const Strategy = require('../lib/strategy');

chai.use(require('@passport-next/chai-passport-strategy'));

describe('Strategy', () => {
  describe('handling a request with a body, but no username and password, with message option to authenticate', () => {
    const strategy = new Strategy(() => {
      throw new Error('should not be called');
    });

    let info, status;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i, s) => {
          info = i;
          status = s;
          done();
        })
        .req((req) => {
          req.body = {};
        })
        .authenticate({ badRequestMessage: 'Something is wrong with this request' });
    });

    it('should fail with info and status', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Something is wrong with this request');
      expect(status).to.equal(400);
    });
  });
});
