'use strict';
const chai = require('chai');
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy', function () {
  describe('failing authentication', function () {
    const strategy = new Strategy(function (username, password, done) {
      return done(null, false);
    });

    let info;

    before(function (done) {
      chai.passport.use(strategy)
        .fail(function (i) {
          info = i;
          done();
        })
        .req(function (req) {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail', function () {
      // eslint-disable-next-line no-unused-expressions
      expect(info).to.be.undefined;
    });
  });

  describe('failing authentication with info', function () {
    const strategy = new Strategy(function (username, password, done) {
      return done(null, false, {message: 'authentication failed'});
    });

    let info;

    before(function (done) {
      chai.passport.use(strategy)
        .fail(function (i) {
          info = i;
          done();
        })
        .req(function (req) {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });

  describe('failing authentication with info and status', function () {
    const strategy = new Strategy(function (username, password, done) {
      return done(null, false, {message: 'authentication failed'}, 403);
    });

    let status;

    before(function (done) {
      chai.passport.use(strategy)
        .fail(function (i, s) {
          status = s;
          done();
        })
        .req(function (req) {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail', function () {
      expect(status).to.equal(403);
    });
  });
});
