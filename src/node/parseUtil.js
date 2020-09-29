/**
 * @param {number|undefined} number
 * @param {number} fallback
 * @returns {number}
 */
module.exports.numberWithFallback = (number, fallback) => (
  Number.isInteger(number) ? number : fallback
);

/**
 * @param {boolean|undefined} bool
 * @param {boolean} fallback
 * @returns {boolean}
 */
module.exports.booleanWithFallback = (bool, fallback) => (
  typeof bool === 'boolean' ? bool : fallback
);
