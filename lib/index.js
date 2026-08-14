// Module dependencies.
import * as passport from '@passport-next/passport-strategy';
import {lookup} from './utils.js';

/**
 * @param {unknown} value
 * @returns {Error}
 */
const asError = (value) => {
  if (Object.prototype.toString.call(value) === '[object Error]') {
    return /** @type {Error} */ (value);
  }
  return new Error(String(value));
};

/** @typedef {import('@passport-next/passport-types').User} User */

/**
 * @typedef {import('@passport-next/passport-types').AuthInfo &
 *   Record<string, unknown> & {
 *   type?: string,
 *   message?: string
 * }} SuccessInfo
 */

/**
 * @typedef {import('@passport-next/http-types').ConnectRequest &
 *   import('@passport-next/passport-types').Request & {
 *     body?: Record<string, unknown>,
 *     query?: Record<string, unknown>
 *   }} Request
 */

/**
 * @callback VerifiedCallback
 * @param {Error | null | undefined} err
 * @param {User | false} [user]
 * @param {SuccessInfo | string} [info] A string is expected for failures
 * @param {number} [status] A status code for failures
 * @returns {void}
 */

/**
 * @typedef {object} UserInfoStatus
 * @property {User | false} user
 * @property {SuccessInfo | string} [info] A string is expected for failures
 * @property {number} [status] A code for failures
 */

/**
 * @callback VerifyCallback
 * @param {string} username
 * @param {string} password
 * @param {VerifiedCallback} verified
 * @throws {Error} Synchronous errors will be passed to the `error` method of
 *   the `Strategy` object
 * @returns {void}
 */

/**
 * @callback VerifyCallbackWithRequest
 * @param {Request} req
 * @param {string} username
 * @param {string} password
 * @param {VerifiedCallback} verified
 * @throws {Error} Synchronous errors will be passed to the `error` method of
 *   the `Strategy` object
 * @returns {void}
 */

/**
 * @callback VerifyPromise
 * @param {string} username
 * @param {string} password
 * @returns {Promise<UserInfoStatus>}
 */

/**
 * @callback VerifyPromiseWithRequest
 * @param {Request} req
 * @param {string} username
 * @param {string} password
 * @returns {Promise<UserInfoStatus>}
 */

/**
 * @typedef {object} StrategyOptions
 * @property {string} [usernameField='username'] Field containing the username
 * @property {string} [passwordField='password'] Field containing the password
 * @property {boolean} [passReqToCallback=false] Pass the request to `verify`
 */

/**
 * @typedef {StrategyOptions & {
 *   passReqToCallback: true
 * }} RequestStrategyOptions
 */

/**
 * @typedef {StrategyOptions & {
 *   passReqToCallback?: false
 * }} DefaultStrategyOptions
 */

/**
 * @typedef {object} AuthenticateOptions
 * @property {string} [badRequestMessage]
 */

/* eslint-disable unicorn/prefer-private-class-fields --
 * Passport executes an Object.create(strategy) clone without private slots.
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
 * passport.use(new LocalStrategy(
 *   async function (username, password) {
 *     const user = await User.findOne({username, password});
 *     return {user};
 *   }
 * ));
 * @public
 */
class Strategy extends passport.EnhancedStrategy {
  /** @type {string} */
  _usernameField;

  /** @type {string} */
  _passwordField;

  /**
   * @type {VerifyCallback | VerifyCallbackWithRequest | VerifyPromise |
   *   VerifyPromiseWithRequest}
   */
  _verify;

  /** @type {boolean|undefined} */
  _passReqToCallback;

  /**
   * @overload
   * @param {VerifyCallback} verify
   */

  /**
   * @overload
   * @param {VerifyPromise} verify
   */

  /**
   * @overload
   * @param {DefaultStrategyOptions} options
   * @param {VerifyCallback} verify
   */

  /**
   * @overload
   * @param {DefaultStrategyOptions} options
   * @param {VerifyPromise} verify
   */

  /**
   * @overload
   * @param {RequestStrategyOptions} options
   * @param {VerifyCallbackWithRequest} verify
   */

  /**
   * @overload
   * @param {RequestStrategyOptions} options
   * @param {VerifyPromiseWithRequest} verify
   */

  /**
   * @param {StrategyOptions | VerifyCallback | VerifyPromise} options
   * @param {VerifyCallback | VerifyCallbackWithRequest | VerifyPromise |
   *   VerifyPromiseWithRequest} [verify]
   */
  constructor (options, verify) {
    if (typeof options === 'function') {
      verify = options;
      options = {};
    }
    if (!verify) {
      throw new TypeError('LocalStrategy requires a verify callback');
    }
    options ||= {};

    super();
    this._usernameField = options.usernameField || 'username';
    this._passwordField = options.passwordField || 'password';

    this.name = 'local';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
  }

  /**
   * Authenticate request based on the contents of a form submission.
   *
   * @param {Request} req
   * @param {AuthenticateOptions} [options]
   * @public
   * @returns {Promise<void>}
   */
  async authenticate (req, options) {
    options ||= {};
    const username = lookup(req.body, this._usernameField) ||
      lookup(req.query, this._usernameField);
    const password = lookup(req.body, this._passwordField) ||
      lookup(req.query, this._passwordField);

    if (typeof username !== 'string' || !username ||
      typeof password !== 'string' || !password) {
      this.fail({
        message: options.badRequestMessage || 'Missing credentials'
      }, 400);
      return;
    }

    /** @type {VerifiedCallback} */
    const verified = (err, user, info, status) => {
      if (err) {
        this.error(err);
        return;
      }
      if (!user) {
        /**
         * @type {(
         *   challenge?: SuccessInfo | string,
         *   status?: number
         * ) => void}
         */
        (this.fail)(info, status);
        return;
      }
      /**
       * @type {(
       *   authenticatedUser: User,
       *   details?: SuccessInfo | string
       * ) => void}
       */
      (this.success)(user, info);
    };

    try {
      /** @type {UserInfoStatus | undefined} */
      let result;
      /** @type {Error | undefined} */
      let error;
      try {
        if (this._passReqToCallback) {
          const verifyWithRequest =
            /**
             * @type {VerifyCallbackWithRequest |
             *   VerifyPromiseWithRequest
             * }
             */ (this._verify);
          result = await verifyWithRequest(
            req, username, password, verified
          );
        } else {
          const verifyWithoutRequest =
            /**
             * @type {VerifyCallback |
             *   VerifyPromise
             * }
             */ (this._verify);
          result = await verifyWithoutRequest(
            username, password, verified
          );
        }
      } catch (err) {
        error = asError(err);
      }

      const promiseSignatureLength = this._passReqToCallback ? 3 : 2;
      if (this._verify.length <= promiseSignatureLength) {
        if (!result) {
          throw error || new TypeError('Verify callback returned no result');
        }
        verified(error, result.user, result.info, result.status);
      } else if (error) {
        throw error;
      }
    } catch (ex) {
      this.error(asError(ex));
    }
  }
}
/* eslint-enable unicorn/prefer-private-class-fields --
 * Passport executes an Object.create(strategy) clone without private slots.
 */

/**
 * Expose `Strategy`.
 */
export default Strategy;
