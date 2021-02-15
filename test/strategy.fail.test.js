'use strict';

const Strategy = require('../lib/strategy');

describe('Strategy', () => {
  describe('failing authentication', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, false);
    });

    let info;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i) => {
          info = i;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail', () => {
      expect(info).to.be.undefined;
    });
  });

  describe('failing authentication with info', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, false, {message: 'authentication failed'});
    });

    let info;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i) => {
          info = i;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('authentication failed');
    });
  });

  describe('failing authentication with info and status', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, false, {message: 'authentication failed'}, 403);
    });

    let status;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i, s) => {
          status = s;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail', () => {
      expect(status).to.equal(403);
    });
  });
});
