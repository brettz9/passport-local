export default Strategy;
export type User = import("@passport-next/passport-types").User;
export type SuccessInfo = import("@passport-next/passport-types").AuthInfo & Record<string, unknown> & {
    type?: string;
    message?: string;
};
export type Request = import("@passport-next/http-types").ConnectRequest & import("@passport-next/passport-types").Request & {
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
};
export type VerifiedCallback = (err: Error | null | undefined, user?: false | import("@passport-next/passport-types").User | undefined, info?: string | SuccessInfo | undefined, status?: number | undefined) => void;
export type UserInfoStatus = {
    user: User | false;
    /**
     * A string is expected for failures
     */
    info?: string | SuccessInfo | undefined;
    /**
     * A code for failures
     */
    status?: number | undefined;
};
export type VerifyCallback = (username: string, password: string, verified: VerifiedCallback) => any;
export type VerifyCallbackWithRequest = (req: Request, username: string, password: string, verified: VerifiedCallback) => any;
export type VerifyPromise = (username: string, password: string) => Promise<UserInfoStatus>;
export type VerifyPromiseWithRequest = (req: Request, username: string, password: string) => Promise<UserInfoStatus>;
export type StrategyOptions = {
    /**
     * Field containing the username
     */
    usernameField?: string | undefined;
    /**
     * Field containing the password
     */
    passwordField?: string | undefined;
    /**
     * Pass the request to `verify`
     */
    passReqToCallback?: boolean | undefined;
};
export type RequestStrategyOptions = StrategyOptions & {
    passReqToCallback: true;
};
export type DefaultStrategyOptions = StrategyOptions & {
    passReqToCallback?: false;
};
export type AuthenticateOptions = {
    badRequestMessage?: string | undefined;
    /**
     * Defaults to `false`
     */
    unsafeFallbackToQueryString?: boolean | undefined;
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
 * @property {boolean} [unsafeFallbackToQueryString] Defaults to `false`
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
declare class Strategy extends passport.EnhancedStrategy {
    /**
     * @overload
     * @param {VerifyCallback} verify
     */
    constructor(verify: VerifyCallback);
    /**
     * @overload
     * @param {VerifyPromise} verify
     */
    constructor(verify: VerifyPromise);
    /**
     * @overload
     * @param {DefaultStrategyOptions} options
     * @param {VerifyCallback} verify
     */
    constructor(options: DefaultStrategyOptions, verify: VerifyCallback);
    /**
     * @overload
     * @param {DefaultStrategyOptions} options
     * @param {VerifyPromise} verify
     */
    constructor(options: DefaultStrategyOptions, verify: VerifyPromise);
    /**
     * @overload
     * @param {RequestStrategyOptions} options
     * @param {VerifyCallbackWithRequest} verify
     */
    constructor(options: RequestStrategyOptions, verify: VerifyCallbackWithRequest);
    /**
     * @overload
     * @param {RequestStrategyOptions} options
     * @param {VerifyPromiseWithRequest} verify
     */
    constructor(options: RequestStrategyOptions, verify: VerifyPromiseWithRequest);
    /** @type {string} */
    _usernameField: string;
    /** @type {string} */
    _passwordField: string;
    /**
     * @type {VerifyCallback | VerifyCallbackWithRequest | VerifyPromise |
     *   VerifyPromiseWithRequest}
     */
    _verify: VerifyCallback | VerifyCallbackWithRequest | VerifyPromise | VerifyPromiseWithRequest;
    /** @type {boolean|undefined} */
    _passReqToCallback: boolean | undefined;
    name: string;
    /**
     * Authenticate request based on the contents of a form submission.
     *
     * @param {Request} req
     * @param {AuthenticateOptions} [options]
     * @public
     * @returns {Promise<void>}
     */
    public authenticate(req: Request, options?: AuthenticateOptions): Promise<void>;
}
import * as passport from '@passport-next/passport-strategy';
