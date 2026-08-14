import {chai, expect, attachBody} from './bootstrap/node.js';
import Strategy from '../lib/index.js';

/** @import {AuthInfo} from '@passport-next/passport-types' */
/** @typedef {string | number | AuthInfo | undefined} FailChallenge */

describe('Strategy', () => {
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
