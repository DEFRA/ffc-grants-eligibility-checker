import Iron from '@hapi/iron';

// Get input values from the command line
const [, , cookie, pwd] = process.argv;

// Validate input
if (!cookie || !pwd) {
  console.error('Usage: node unseal-cookie.js <cookie> <password>');
  process.exit(1);
}

/**
 * Asynchronously unseals an encrypted cookie using the provided password.
 * @param {string} cookie - The encrypted cookie string to be unsealed.
 * @param {string} pwd - The password used to unseal the cookie.
 * @returns {Promise<void>} - A promise that resolves when the cookie is successfully unsealed.
 *                             Logs the unsealed cookie to the console in JSON format.
 *                             Logs an error message if unsealing fails.
 */
async function unsealCookie(cookie, pwd) {
  try {
    const unsealed = await Iron.unseal(cookie, pwd, Iron.defaults);
    console.log('Unsealed Cookie:');
    console.log(JSON.stringify(unsealed, null, 2));
  } catch (error) {
    console.error('Failed to unseal the cookie:', error.message);
  }
}

// Execute the function
unsealCookie(cookie, pwd);
