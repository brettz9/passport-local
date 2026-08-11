import {chai, expect, attachBody} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

describe('Strategy', () => {
  describe('encountering an error during verification', () => {
    const strategy = new Strategy((username, password, done) => {
      done(new Error('something went wrong'));
    });

    /** @type {Error} */
    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
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

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went wrong');
    });
  });

  describe('encountering an exception during verification', () => {
    // eslint-disable-next-line no-unused-vars -- Arity checked
    const strategy = new Strategy((username, password, done) => {
      throw new Error('something went horribly wrong');
    });

    /** @type {Error} */
    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
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

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  });

  describe('encountering a non-Error exception during verification', () => {
    // eslint-disable-next-line no-unused-vars -- Arity checked
    const strategy = new Strategy((username, password, done) => {
      // eslint-disable-next-line no-throw-literal -- Normalization under test
      throw 'something went strangely wrong';
    });

    /** @type {Error} */
    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
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

    it('should normalize the exception to an Error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went strangely wrong');
    });
  });

  describe('receiving no result from a promise verifier', () => {
    // eslint-disable-next-line require-await -- Missing result under test
    const strategy = new Strategy(async () => undefined);

    /** @type {Error} */
    let err;

    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
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

    it('should error', () => {
      expect(err).to.be.an.instanceof(TypeError);
      expect(err.message).to.equal('Verify callback returned no result');
    });
  });
});
