/* eslint-disable promise/prefer-await-to-callbacks --
 * Passport authentication exposes a callback API.
 */
import {Passport} from '@passport-next/passport';
import LocalStrategy from '@passport-next/passport-local';
import {expect} from './bootstrap/node.js';

/** @import {ConnectMiddleware} from '@passport-next/passport' */
/** @import {ConnectRequest} from '@passport-next/http-types' */

/**
 * @returns {import('@passport-next/http-types').ConnectResponse}
 */
const createResponse = () => ({
  statusCode: 200,
  setHeader () {
    return undefined;
  },
  end () {
    return undefined;
  }
});

/**
 * @param {ConnectMiddleware} middleware
 * @param {ConnectRequest} req
 * @returns {Promise<void>}
 */
// eslint-disable-next-line promise/avoid-new -- Adapt callback middleware.
const runMiddleware = (middleware, req) => new Promise((resolve, reject) => {
  middleware(req, createResponse(), (err) => {
    if (err) {
      reject(err);
      return;
    }
    resolve();
  });
});

describe('@passport-next/passport integration', () => {
  it('should authenticate with @passport-next/passport-local', (done) => {
    const authenticator = new Passport();
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
       * @param {import('@passport-next/passport-types').User | false} [user]
       * @param {unknown} [info]
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

    const request = {
      headers: {},
      body: {username: 'johndoe', password: 'secret'},
      query: {}
    };
    authenticate(request, createResponse(), done);
  });

  it('should persist and restore an authenticated session', async () => {
    const authenticator = new Passport();

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
    authenticator.serializeUser((_request, user) => {
      return /** @type {{id: string}} */ (user).id;
    });

    // A later request uses that ID to recover the full application user.
    authenticator.deserializeUser((_request, id) => {
      return {id, username: 'johndoe'};
    });

    /** @type {{passport?: {user: string}}} */
    const session = {};
    const loginRequest = {
      headers: {},
      body: {username: 'johndoe', password: 'secret'},
      query: {},
      session
    };

    // initialize() installs req.logIn; successful authentication calls it and
    // writes the serialized user into the shared session object.
    await runMiddleware(authenticator.initialize(), loginRequest);
    await runMiddleware(authenticator.authenticate('local'), loginRequest);

    expect(session).to.deep.equal({passport: {user: '1234'}});

    /**
     * @type {{
     *   headers: import('@passport-next/http-types').ConnectRequest['headers'],
     *   session: typeof session,
     *   user?: object
     * }}
     */
    const restoredRequest = {headers: {}, session};

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
