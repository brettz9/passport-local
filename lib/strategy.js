'use strict';

// Module dependencies.
const passport = require('@passport-next/passport-strategy');
const {lookup} = require('./utils');

/**
* @callback VerifyCallback
* @param {Request} req
* @param {string} username
* @param {string} password
* @param {VerifiedCallback} verified
* @returns {void}
*/

/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occurred, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * @example
 *     passport.use(new LocalStrategy(
 *       async function (username, password, done) {
 *         const user = await User.findOne({username, password});
 *         return user;
 *       }
 *     ));
 * @public
 */
class Strategy extends passport.Strategy {
  /**
  * @param {PlainObject} [options]
  * @param {string} [options.usernameField=username] Field name where the
  *   username is found
  * @param {string} [options.passwordField=password] Field name where the
  *   password is found
  * @param {boolean} [options.passReqToCallback=false] When `true`, `req`
  *   is the first argument to the verify callback
  * @param {VerifyCallback} verify
  */
  constructor (options, verify) {
    if (typeof options === 'function') {
      verify = options;
      options = {};
    }
    if (!verify) {
      throw new TypeError('LocalStrategy requires a verify callback');
    }

    super();
    this._usernameField = options.usernameField || 'username';
    this._passwordField = options.passwordField || 'password';

    this.name = 'local';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
  }

  /**
  * @typedef {PlainObject} AuthenticateOptions
  * @property {string} badRequestMessage
  */

  /**
   * Authenticate request based on the contents of a form submission.
   *
   * @param {Request} req
   * @param {AuthenticateOptions} options
   * @protected
   * @returns {void}
   */
  authenticate (req, options) {
    options = options || {};
    const username = lookup(req.body, this._usernameField) ||
      lookup(req.query, this._usernameField);
    const password = lookup(req.body, this._passwordField) ||
      lookup(req.query, this._passwordField);

    if (!username || !password) {
      this.fail({
        message: options.badRequestMessage || 'Missing credentials'
      }, 400);
      return;
    }

    /**
    * @typedef {GenericObject} User
    */

    /**
    * @typedef {PlainObject} SuccessInfo
    * @property {string} [type="success"]
    * @property {string} [message]
    */
    /**
     * @name VerifiedCallback
     * @param {Error} err
     * @param {User} [user]
     * @param {SuccessInfo|string} [info] A string is expected for failures
     * @param {number} [status]
     * @returns {void}
     */
    const verified = (err, user, info, status) => {
      if (err) { this.error(err); return; }
      if (!user) { this.fail(info, status); return; }
      this.success(user, info);
    };

    try {
      if (this._passReqToCallback) {
        this._verify(req, username, password, verified);
      } else {
        this._verify(username, password, verified);
      }
    } catch (ex) {
      this.error(ex);
    }
  }
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
