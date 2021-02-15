'use strict';

// eslint-disable-next-line no-shadow -- Bootstrap
const chai = require('chai');

chai.use(require('chai-passport-strategy'));

global.chai = chai;
global.expect = chai.expect;
