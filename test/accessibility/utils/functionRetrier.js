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
      console.warn('functionRetrier: Calling fn on attempt ' + attempts);
      return await fn();
    } catch (error) {
      console.warn('functionRetrier: Caught error: ' + error.errorMessage);

      if (attempts === retries) {
        console.warn('functionRetrier: Throwing error after limit reached');
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.warn('functionRetrier: Retrying after waiting');
      continue;
    }
  } while (true);
};
