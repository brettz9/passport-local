'use strict';

const Strategy = require('../lib/strategy');

describe('Strategy', () => {
  describe('handling a request with valid credentials in body using ' +
    'custom field names', () => {
    const strategy = new Strategy({
      usernameField: 'userid', passwordField: 'passwd'
    }, (username, password, done) => {
      if (username === 'johndoe' && password === 'secret') {
        return done(null, {id: '1234'}, {scope: 'read'});
      }
      return done(null, false);
    });

    let user, info;

    before((done) => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u;
          info = i;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.userid = 'johndoe';
          req.body.passwd = 'secret';
        })
        .authenticate();
    });

    it('should supply user', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(info).to.be.an('object');
      expect(info.scope).to.equal('read');
    });
  });

  describe('handling a request with valid credentials in body using ' +
    'custom field names with object notation', () => {
    const strategy = new Strategy({
      usernameField: 'user[username]', passwordField: 'user[password]'
    }, (username, password, done) => {
      if (username === 'johndoe' && password === 'secret') {
        return done(null, {id: '1234'}, {scope: 'read'});
      }
      return done(null, false);
    });

    let user,
      info;

    before((done) => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u;
          info = i;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.user = {};
          req.body.user.username = 'johndoe';
          req.body.user.password = 'secret';
        })
        .authenticate();
    });

    it('should supply user', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1234');
    });

    it('should supply info', () => {
      expect(info).to.be.an('object');
      expect(info.scope).to.equal('read');
    });
  });
});
