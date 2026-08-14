import {chai, expect, attachBody} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

/** @import {AuthInfo} from '@passport-next/passport-types' */
/** @typedef {string | number | AuthInfo | undefined} FailChallenge */

describe('Strategy', () => {
  describe('failing authentication', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, false);
    });

    /** @type {FailChallenge} */
    let info;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i) => {
          info = i;
          done();
        })
        .request((req) => {
          attachBody(req, {
            username: 'johndoe',
            password: 'secret'
          });
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

    /** @type {FailChallenge} */
    let info;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i) => {
          info = i;
          done();
        })
        .request((req) => {
          attachBody(req, {
            username: 'johndoe',
            password: 'secret'
          });
        })
        .authenticate();
    });

    it('should fail', () => {
      expect(info).to.be.an('object');
      expect(
        /** @type {{message: string}} */
        (info).message
      ).to.equal('authentication failed');
    });
  });

  describe('failing authentication with info and status', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, false, {message: 'authentication failed'}, 403);
    });

    /** @type {number | undefined} */
    let status;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i, s) => {
          status = s;
          done();
        })
        .request((req) => {
          attachBody(req, {
            username: 'johndoe',
            password: 'secret'
          });
        })
        .authenticate();
    });

    it('should fail', () => {
      expect(status).to.equal(403);
    });
  });
});
