/**
 * Retries a function while an error is being thrown with a specified errorMessage for a given number of times.
 * @param {Function} fn - The function to be retried.
 * @param {string} errorMessage - The error message to look for when deciding to retry.
 * @param {number} retries - The number of retries to make before throwing the error. Optional, defaults to 10.
 * @returns {object} The result of the function.
 */
export const functionRetrier = async (fn, errorMessage, retries = 10) => {
  let attempts = 0;

  do {
    attempts++;

    try {
      console.warn('functionRetrier: Calling fn on attempt ' + attempts);
      return await fn();
    } catch (error) {
      console.warn('functionRetrier: Caught error ' + error.errorMessage);
      if (error.errorMessage !== errorMessage) {
        console.warn('functionRetrier: Throwing unexpected error');
        throw error;
      }

      if (attempts === retries) {
        console.warn('functionRetrier: Throwing expected error after limit reached');
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.warn('functionRetrier: Retrying after waiting');
      continue;
    }
  } while (true);
};
