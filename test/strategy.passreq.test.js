import {chai, expect, attachBody} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

describe('Strategy', function () {
  describe('passing request to verify callback', function () {
    const strategy = new Strategy({
      passReqToCallback: true
    }, function (req, username, password, done) {
      if (username === 'johndoe' && password === 'secret') {
        return done(
          null,
          {id: '1234'},
          {scope: 'read', foo: req.headers['x-foo']}
        );
      }
      return done(null, false);
    });

    /** @type {{id?: string}} */
    let user;
    /** @type {{scope?: string, foo?: string} | undefined} */
    let info;

    before(function (done) {
      chai.passport.use(strategy)
        .success(function (u, i) {
          user = u;
          info = i;
          done();
        })
        .request((req) => {
          req.headers['x-foo'] = 'hello';

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
      expect(info?.scope).to.equal('read');
    });

    it('should supply request header in info', () => {
      expect(info?.foo).to.equal('hello');
    });
  });

  describe('passing request to verify callback (async)', function () {
    this.timeout(10000);
    const strategy = new Strategy({
      passReqToCallback: true
    // eslint-disable-next-line require-await -- Testing only
    }, async function (req, username, password) {
      if (username === 'johndoe' && password === 'secret') {
        return {
          user: {id: '1234'},
          info: {scope: 'read', foo: req.headers['x-foo']}
        };
      }
      return {
        user: false
      };
    });

    /** @type {{id?: string}} */
    let user;
    /** @type {{scope?: string, foo?: string} | undefined} */
    let info;

    before(function (done) {
      chai.passport.use(strategy)
        .success(function (u, i) {
          user = u;
          info = i;
          done();
        })
        .request(function (req) {
          req.headers['x-foo'] = 'hello';

          attachBody(req, {
            username: 'johndoe',
            password: 'secret'
          });
        })
        .authenticate();
    });

    it('should supply user', function () {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', function () {
      expect(info).to.be.an('object');
      expect(info?.scope).to.equal('read');
    });

    it('should supply request header in info', function () {
      expect(info?.foo).to.equal('hello');
    });
  });
});
