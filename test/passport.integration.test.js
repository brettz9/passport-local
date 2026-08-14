/* eslint-disable promise/prefer-await-to-callbacks --
 * Passport authentication exposes a callback API.
 */
// @ts-expect-error -- Passport 3 does not publish TypeScript declarations.
import passport from '@passport-next/passport';
import LocalStrategy from '@passport-next/passport-local';
import {expect} from './bootstrap/node.js';

/**
 * @callback Middleware
 * @param {object} req
 * @param {object} res
 * @param {(err?: Error) => void} next
 * @returns {void}
 */

/**
 * @param {Middleware} middleware
 * @param {object} req
 * @returns {Promise<void>}
 */
// eslint-disable-next-line promise/avoid-new -- Adapt callback middleware.
const runMiddleware = (middleware, req) => new Promise((resolve, reject) => {
  middleware(req, {}, (err) => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
  });
});

describe('@passport-next/passport integration', () => {
  it('should authenticate with @passport-next/passport-local', (done) => {
    const authenticator = new passport.Passport();
    authenticator.use(new LocalStrategy((username, password, verified) => {
      if (username === 'johndoe' && password === 'secret') {
        verified(null, {id: '1234'}, {scope: 'read'});
        return;
      }
      verified(null, false);
    }));

    const authenticate = authenticator.authenticate(
      'local',
      {session: false},
      /**
       * @param {Error | null} err
       * @param {{id: string} | false} user
       * @param {{scope: string}} info
       * @returns {void}
       */
      (err, user, info) => {
        try {
          expect(err).to.be.null;
          expect(user).to.deep.equal({id: '1234'});
          expect(info).to.deep.equal({scope: 'read'});
          done();
        } catch (error) {
          done(error);
        }
      }
    );

    authenticate({
      body: {username: 'johndoe', password: 'secret'},
      query: {}
    }, {}, done);
  });

  it('should persist and restore an authenticated session', async () => {
    const authenticator = new passport.Passport();

    // LocalStrategy verifies credentials and supplies the full application
    // user.
    authenticator.use(new LocalStrategy((username, password, verified) => {
      if (username === 'johndoe' && password === 'secret') {
        verified(null, {id: '1234'});
        return;
      }
      verified(null, false);
    }));

    // Passport stores only the serialized ID rather than the full user object.
    authenticator.serializeUser(
      /**
       * @param {{id: string}} user
       * @param {(err: null, userId: string) => void} serialized
       * @returns {void}
       */
      (user, serialized) => {
        serialized(null, user.id);
      }
    );

    // A later request uses that ID to recover the full application user.
    authenticator.deserializeUser(
      /**
       * @param {string} id
       * @param {(err: null, user: object) => void} deserialized
       * @returns {void}
       */
      (id, deserialized) => {
        deserialized(null, {id, username: 'johndoe'});
      }
    );

    /** @type {{passport?: {user: string}}} */
    const session = {};
    const loginRequest = {
      body: {username: 'johndoe', password: 'secret'},
      query: {},
      session
    };

    // initialize() installs req.logIn; successful authentication calls it and
    // writes the serialized user into the shared session object.
    await runMiddleware(authenticator.initialize(), loginRequest);
    await runMiddleware(authenticator.authenticate('local'), loginRequest);

    expect(session).to.deep.equal({passport: {user: '1234'}});

    /** @type {{session: typeof session, user?: object}} */
    const restoredRequest = {session};

    // Simulate a subsequent request carrying the same session. session()
    // deserializes its stored ID and assigns the recovered user to req.user.
    await runMiddleware(authenticator.initialize(), restoredRequest);
    await runMiddleware(authenticator.session(), restoredRequest);

    expect(restoredRequest.user).to.deep.equal({
      id: '1234',
      username: 'johndoe'
    });
  });
});
