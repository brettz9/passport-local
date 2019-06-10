'use strict';

exports.lookup = function (obj, field) {
  if (!obj) { return null; }
  const chain = field.split(']').join('').split('[');
  for (const item of chain) {
    const prop = obj[item];
    if (typeof prop === 'undefined') { return null; }
    if (typeof prop !== 'object') { return prop; }
    obj = prop;
  }
  return null;
};
