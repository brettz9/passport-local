import {chai, expect, attachBody} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

/** @import {AuthInfo} from '@passport-next/passport-types' */
/** @typedef {string | number | AuthInfo | undefined} FailChallenge */
/** @typedef {string | AuthInfo | undefined} SuccessInfo */

describe('Strategy', () => {
  describe('handling a request with valid credentials in body', () => {
    const strategy = new Strategy((username, password, done) => {
      if (username === 'johndoe' && password === 'secret') {
        return done(null, {id: '1234'}, {scope: 'read'});
      }
      return done(null, false);
    });

    /** @type {{id?: string}} */
    let user;
    /** @type {SuccessInfo} */
    let info;

    before((done) => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u;
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

    it('should supply user', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(info).to.be.an('object');
      expect(
        /** @type {{scope?: string}} */ (info).scope
      ).to.equal('read');
    });
  });

  describe('handling a request with valid credentials in query', () => {
    const strategy = new Strategy((username, password, done) => {
      if (username === 'johndoe' && password === 'secret') {
        return done(null, {id: '1234'}, {scope: 'read'});
      }
      return done(null, false);
    });

    /** @type {{id?: string}} */
    let user;
    /** @type {SuccessInfo} */
    let info;

    before((done) => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u;
          info = i;
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

    it('should supply user', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(info).to.be.an('object');
      expect(
        /** @type {{scope?: string}} */ (info).scope
      ).to.equal('read');
    });
  });

  describe('handling a request without a body', () => {
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
        .authenticate();
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
      ).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe(
    'handling a request with a body, but no username and password', () => {
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
          .authenticate();
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
        ).to.equal('Missing credentials');
        expect(status).to.equal(400);
      });
    }
  );

  describe(
    'handling a request with a body, but no password (empty user name)',
    () => {
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
            attachBody(req, {
              username: {}
            });
          })
          .authenticate();
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
        ).to.equal('Missing credentials');
        expect(status).to.equal(400);
      });
    }
  );

  describe('handling a request with a body, but no password', () => {
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
          attachBody(req, {
            username: 'johndoe'
          });
        })
        .authenticate();
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
      ).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but no username', () => {
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
          attachBody(req, {
            password: 'secret'
          });
        })
        .authenticate();
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
      ).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
});
