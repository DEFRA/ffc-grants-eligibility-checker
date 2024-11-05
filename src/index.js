// istanbul ignore file
import { init } from './server.js';

/**
 * handleError is a function that handles errors by logging them to the console
 * and then terminating the process with an exit code of 1.
 * @param {Error} err - The error object that needs to be handled.
 */
const handleError = (err) => {
  console.error(err);
  process.exit(1);
};

process.on('unhandledRejection', handleError);

init()
  .then(() => console.log('Server initialised'))
  .catch((e) => console.error(e));
