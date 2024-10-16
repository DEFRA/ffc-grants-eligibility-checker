/**
 * Composes multiple functions into a single function.
 * This function takes a series of functions as arguments and returns a new function
 * that is the composition of the input functions. The composed function is executed
 * from right to left, passing the result of each function to the next.
 * @param {...Function} fns - A variable number of functions to be composed.
 * @returns {Function} A new function that represents the composition of the input functions.
 */
export const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);
