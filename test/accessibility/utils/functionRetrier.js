/**
 * Retries a function while an error is being thrown for a given number of times.
 * @param {Function} fn - The function to be retried.
 * @param {number} retries - The number of retries to make before throwing the error. Optional, defaults to 10.
 * @returns {object} The result of the function.
 */
export const functionRetrier = async (fn, retries = 10) => {
  let attempts = 0;

  do {
    attempts++;
    try {
      return await fn();
    } catch (error) {
      if (attempts === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } while (true);
};
