import * as chaiModule from 'chai';
import chaiPassportStrategy from '@passport-next/chai-passport-strategy';

const chai = /** @type {ReturnType<typeof chaiPassportStrategy>} */ (
  chaiModule.use(chaiPassportStrategy)
);
const {expect} = chai;

/**
 * @template {Record<string, unknown>} Body
 * @param {object} req
 * @param {Body} body
 * @returns {asserts req is object & {body: Body}}
 */
function attachBody (req, body) {
  Object.assign(req, {body});
}

export {chai, expect, attachBody};
