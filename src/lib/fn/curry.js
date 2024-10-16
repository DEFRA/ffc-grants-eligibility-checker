/**
 * Curries a function which enables partial application of arguments.
 * @param {Function} fn - The function to be curried.
 * @returns {Function} - The curried function which can accept partial arguments
 *                      until all arguments are provided to call the original
 *                      function.
 */
export const curry =
  (fn) =>
  (...args) =>
    args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));
