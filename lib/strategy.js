'use strict';
/**
 * Module dependencies.
 */
const util = require('util');
const passport = require('@passport-next/passport-strategy');
const { lookup } = require('./utils');


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
 *       (username, password, done) => {
 *         User.findOne({ username, password }, (err, user) => {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @returns {undefined}
 * @param {Object} options contains the properties:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to
 * @param {GenericCallback} verify the verify callback (default: `false`)
 */
function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

  this._usernameField = options.usernameField || 'username';
  this._passwordField = options.passwordField || 'password';

  passport.Strategy.call(this);
  this.name = 'local';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @param {Object} options
 * @returns {undefined}
 */
Strategy.prototype.authenticate = function authenticate(req, options) {
  options = options || {};
  const username = lookup(req.body, this._usernameField) || lookup(req.query, this._usernameField);
  const password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);

  if (!username || !password) {
    this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    return;
  }


  /**
 * @param {Error} err
 * @param {Object} user
 * @param {Object} info
 * @param {Object} status
 * @returns {undefined}
 */
  function verified(err, user, info, status) {
    if (err) { return this.error(err); }
    if (!user) { return this.fail(info, status); }
    return this.success(user, info);
  }


  try {
    if (this._passReqToCallback) {
      this._verify(req, username, password, verified.bind(this));
    } else {
      this._verify(username, password, verified.bind(this));
    }
  } catch (ex) {
    this.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
