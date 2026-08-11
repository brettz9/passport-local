/**
 * @param {Record<string, unknown> | null | undefined} obj
 * @param {string} field
 * @returns {unknown | null}
 */
export const lookup = function (obj, field) {
  if (!obj) {
    return null;
  }
  /** @type {Record<string, unknown>} */
  let current = obj;
  const chain = field.replaceAll(']', '').split('[');
  for (const item of chain) {
    if (item === '__proto__' || item === 'prototype' ||
      item === 'constructor' || !Object.hasOwn(current, item)) {
      return null;
    }
    const prop = current[item];
    if (typeof prop === 'undefined') {
      return null;
    }
    if (prop === null) {
      return null;
    }
    if (typeof prop !== 'object') {
      return prop;
    }
    current = /** @type {Record<string, unknown>} */ (prop);
  }
  return null;
};
