'use strict';
const chai = require('chai');
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy', function () {
  describe('handling a request with a body, but no username and ' +
    'password, with message option to authenticate', function () {
    const strategy = new Strategy(function (username, password, done) {
      throw new Error('should not be called');
    });

    let info, status;

    before(function (done) {
      chai.passport.use(strategy)
        .fail(function (i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function (req) {
          req.body = {};
        })
        .authenticate({
          badRequestMessage: 'Something is wrong with this request'
        });
    });

    it('should fail with info and status', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Something is wrong with this request');
      expect(status).to.equal(400);
    });
  });
});
