'use strict';
const chai = require('chai');
const Strategy = require('../lib/strategy');

chai.use(require('chai-passport-strategy'));

describe('Strategy', function () {
  describe('handling a request with valid credentials in body', function () {
    const strategy = new Strategy(function (username, password, done) {
      if (username === 'johndoe' && password === 'secret') {
        return done(null, {id: '1234'}, {scope: 'read'});
      }
      return done(null, false);
    });

    let user, info;

    before(function (done) {
      chai.passport.use(strategy)
        .success(function (u, i) {
          user = u;
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

    it('should supply user', function () {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', function () {
      expect(info).to.be.an('object');
      expect(info.scope).to.equal('read');
    });
  });

  describe('handling a request with valid credentials in query', function () {
    const strategy = new Strategy(function (username, password, done) {
      if (username === 'johndoe' && password === 'secret') {
        return done(null, {id: '1234'}, {scope: 'read'});
      }
      return done(null, false);
    });

    let user, info;

    before(function (done) {
      chai.passport.use(strategy)
        .success(function (u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function (req) {
          req.query = {};
          req.query.username = 'johndoe';
          req.query.password = 'secret';
        })
        .authenticate();
    });

    it('should supply user', function () {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', function () {
      expect(info).to.be.an('object');
      expect(info.scope).to.equal('read');
    });
  });

  describe('handling a request without a body', function () {
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
        .authenticate();
    });

    it('should fail with info and status', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but no username ' +
    'and password', function () {
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
        .authenticate();
    });

    it('should fail with info and status', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but a bad username', function () {
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
          req.body = {
            username: {}
          };
        })
        .authenticate();
    });

    it('should fail with info and status', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but no password', function () {
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
          req.body.username = 'johndoe';
        })
        .authenticate();
    });

    it('should fail with info and status', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but no username', function () {
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
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', function () {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
});
