# passport-local

[![Build Status](https://travis-ci.org/passport-next/passport-local.svg?branch=master)](https://travis-ci.org/passport-next/passport-local)
[![Coverage Status](https://coveralls.io/repos/github/passport-next/passport-local/badge.svg?branch=master)](https://coveralls.io/github/passport-next/passport-local?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b7ff64d57f9f816260a3/maintainability)](https://codeclimate.com/github/passport-next/passport-local/maintainability)
[![Dependencies](https://david-dm.org/passport-next/passport-local.png)](https://david-dm.org/passport-next/passport-local)
<!--[![SAST](https://gitlab.com/passport-next/passport-local/badges/master/build.svg)](https://gitlab.com/passport-next/passport-local/badges/master/build.svg)-->

[Passport](http://passportjs.org/) strategy for authenticating with a username
and password.

This module lets you authenticate using a username and password in your Node.js
applications.  By plugging into Passport, local authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
npm install @passport-next/passport-local
```

## Usage

#### Configure Strategy

The local authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which accepts these
credentials and resolves to a user (or throws or returns `false`).

```js
const passport = require('@passport-next/passport');
const LocalStrategy = require('@passport-next/passport-local').Strategy;

passport.use(new LocalStrategy(
  async function (username, password) {
    let user;
    try {
      user = await User.findOne({username});
    } catch (err) {
      console.log(err);
      throw err;
    }
    if (!user || !user.verifyPassword(password)) {
      return {user: false};
    }
    return {user};
  }
));
```

##### Available Options

This strategy takes an optional options hash before the function, e.g. `new LocalStrategy({/* options */ }, callback)`.

The available options are:

* `usernameField` - Optional, defaults to 'username'
* `passwordField` - Optional, defaults to 'password'

Both fields define the name of the properties in the POST body that are sent to the server.

#### Parameters

By default, `LocalStrategy` expects to find credentials in parameters
named `username` and `password`. If your site prefers to name these fields
differently, options are available to change the defaults.

```js
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
  },
  function (username, password, done) {
    // ...
  })
);
```

The verify callback can be supplied with the `request` object by setting
the `passReqToCallback` option to true, and changing callback arguments
accordingly.

```js
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd',
    passReqToCallback: true
  },
  function (req, username, password, done) {
    // request object is now first argument
    // ...
  })
);
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'local'` strategy, to
authenticate requests. It searches for fields in the query string and
`req.body`, so ensure body parsers are in place if these fields are
sent in the body.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

app.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function (req, res) {
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-local-example)
as a starting point for their own web applications.

Additional examples can be found on the [wiki](https://github.com/jaredhanson/passport-local/wiki/Examples).

## Tests

```bash
npm install
npm test
```
