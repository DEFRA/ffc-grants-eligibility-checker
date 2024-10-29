export const OK = Symbol('OK');
export const BAD_REQUEST = Symbol('BAD_REQUEST');
export const FORBIDDEN = Symbol('FORBIDDEN');
export const NOT_FOUND = Symbol('NOT_FOUND');
export const INTERNAL_SERVER_ERROR = Symbol('INTERNAL_SERVER_ERROR');

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
 * The HTTP status code for a bad request.
 * @constant {number}
 */
statusCodeMap.set(BAD_REQUEST, 400); // NOSONAR:S109 - Allow magic number

/**
 * The HTTP status code for a forbidden request.
 * @constant {number}
 */
statusCodeMap.set(FORBIDDEN, 403); // NOSONAR:S109 - Allow magic number

/**
 * The HTTP status code for a resource that was not found.
 * @constant {number}
 */
statusCodeMap.set(NOT_FOUND, 404); // NOSONAR:S109 - Allow magic number

/**
 * The HTTP status code for a server error.
 * @constant {number}
 */
statusCodeMap.set(INTERNAL_SERVER_ERROR, 500); // NOSONAR:S109 - Allow magic number

/**
 * Returns a HTTP status code based on the code given.
 * @param {symbol} code - One of the status codes from the export
 * @returns {number} - The corresponding HTTP status code
 */
export default function (code) {
  return statusCodeMap.get(code);
}
