import {chai, expect, attachBody} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

/** @import {AuthInfo} from '@passport-next/passport-types' */
/** @typedef {string | number | AuthInfo | undefined} FailChallenge */

describe('Strategy', () => {
  describe('with query string fallback disabled by default', () => {
    const strategy = new Strategy(() => {
      throw new Error('should not be called');
    });

    /** @type {FailChallenge} */
    let info;

    before((done) => {
      chai.passport.use(strategy)
        .fail((challenge) => {
          info = challenge;
          done();
        })
        .request((req) => {
          Object.assign(req, {
            query: {
              username: 'johndoe',
              password: 'secret'
            }
          });
        })
        .authenticate();
    });

    it('should not use query string credentials', () => {
      expect(info).to.be.an('object');
      expect(
        /** @type {{message: string}} */ (info).message
      ).to.equal('Missing credentials');
    });
  });

  describe('with query string fallback enabled', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, {username, password});
    });

    /** @type {import('@passport-next/passport-types').User | undefined} */
    let user;

    before((done) => {
      chai.passport.use(strategy)
        .success((authenticatedUser) => {
          user = authenticatedUser;
          done();
        })
        .request((req) => {
          Object.assign(req, {
            query: {
              username: 'johndoe',
              password: 'secret'
            }
          });
        })
        .authenticate({unsafeFallbackToQueryString: true});
    });

    it('should use query string credentials', () => {
      expect(user).to.deep.equal({
        username: 'johndoe',
        password: 'secret'
      });
    });
  });

  describe('with body and query string credentials', () => {
    const strategy = new Strategy((username, password, done) => {
      return done(null, {username, password});
    });

    /** @type {import('@passport-next/passport-types').User | undefined} */
    let user;

    before((done) => {
      chai.passport.use(strategy)
        .success((authenticatedUser) => {
          user = authenticatedUser;
          done();
        })
        .request((req) => {
          attachBody(req, {
            username: 'body-user',
            password: 'secret'
          });
          Object.assign(req, {
            query: {
              username: 'query-user',
              password: 'secret'
            }
          });
        })
        .authenticate({unsafeFallbackToQueryString: true});
    });

    it('should prefer body credentials', () => {
      expect(user).to.deep.equal({
        username: 'body-user',
        password: 'secret'
      });
    });
  });

  describe(
    'handling a request with a body, but no username and password, ' +
    'with message option to authenticate', () => {
      const strategy = new Strategy(() => {
        throw new Error('should not be called');
      });

      /** @type {FailChallenge} */
      let info;

      /** @type {number | undefined} */
      let status;

      before((done) => {
        chai.passport.use(strategy)
          .fail((i, s) => {
            info = i;
            status = s;
            done();
          })
          .request((req) => {
            attachBody(req, {});
          })
          .authenticate({
            badRequestMessage: 'Something is wrong with this request'
          });
      });

      it('should fail with info and status', () => {
        expect(info).to.be.an('object');
        expect(
          /**
           * @type {{
           *   type?: string,
           *   message: string
           * }}
           */
          (info).message
        ).to.equal('Something is wrong with this request');
        expect(status).to.equal(400);
      });
    }
  );
});
