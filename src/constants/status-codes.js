export const OK = Symbol('OK');
export const NOT_FOUND = Symbol('NOT_FOUND');

/**
 * A map of status codes and their corresponding HTTP status code values.
 * @typedef {Map} StatusCodeMap
 */
const statusCodeMap = new Map();

/**
 * The HTTP status code for a successful request.
 * @constant {number}
 */
statusCodeMap.set(OK, 200); // NOSONAR:S109 - Allow magic number

/**
 * The HTTP status code for a resource that was not found.
 * @constant {number}
 */
statusCodeMap.set(NOT_FOUND, 404); // NOSONAR:S109 - Allow magic number

/**
 * Returns a HTTP status code based on the code given.
 * @param {symbol} code - One of the status codes from the export
 * @returns {number} - The corresponding HTTP status code
 */
export default function (code) {
  return statusCodeMap.get(code);
}
