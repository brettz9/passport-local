'use strict';
const Strategy = require('../lib/strategy.js');

describe('Strategy', () => {
  describe('handling a request with valid credentials in body', () => {
    const strategy = new Strategy((username, password, done) => {
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
          req.body.username = 'johndoe';
          req.body.password = 'secret';
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

  describe('handling a request with valid credentials in query', () => {
    const strategy = new Strategy((username, password, done) => {
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
          req.query = {};
          req.query.username = 'johndoe';
          req.query.password = 'secret';
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

  describe('handling a request without a body', () => {
    const strategy = new Strategy(() => {
      throw new Error('should not be called');
    });

    let info, status;

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
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe(
    'handling a request with a body, but no username and password', () => {
      const strategy = new Strategy(() => {
        throw new Error('should not be called');
      });

      let info, status;

      before((done) => {
        chai.passport.use(strategy)
          .fail((i, s) => {
            info = i;
            status = s;
            done();
          })
          .req((req) => {
            req.body = {};
          })
          .authenticate();
      });

      it('should fail with info and status', () => {
        expect(info).to.be.an('object');
        expect(info.message).to.equal('Missing credentials');
        expect(status).to.equal(400);
      });
    }
  );

  describe('handling a request with a body, but no password', () => {
    const strategy = new Strategy(() => {
      throw new Error('should not be called');
    });

    let info, status;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i, s) => {
          info = i;
          status = s;
          done();
        })
        .req((req) => {
          req.body = {
            username: {}
          };
        })
        .authenticate();
    });

    it('should fail with info and status', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but no password', () => {
    const strategy = new Strategy(() => {
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

    it('should fail with info and status', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });

  describe('handling a request with a body, but no username', () => {
    const strategy = new Strategy(() => {
      throw new Error('should not be called');
    });

    let info, status;

    before((done) => {
      chai.passport.use(strategy)
        .fail((i, s) => {
          info = i;
          status = s;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should fail with info and status', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
});
