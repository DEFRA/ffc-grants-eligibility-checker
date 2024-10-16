import statusCodes, { NOT_FOUND } from "../constants/status-codes.js";

/**
 * Returns a Hapi response object with a 404 status code and a 'Grant type not found' message.
 * @param {object} h - The Hapi response toolkit.
 * @returns {object} A Hapi response object with a 404 status code.
 */
export function getInvalidGrantTypeResponse(h) {
  return h.response("Grant type not found").code(statusCodes(NOT_FOUND));
}
/**
 * Returns a Hapi response object with a 404 status code and a 'Page not found' message.
 * @param {object} h - The Hapi response toolkit.
 * @returns {object} A Hapi response object with a 404 status code.
 */
export function getInvalidPageResponse(h) {
  return h.response("Page not found").code(statusCodes(NOT_FOUND));
}
