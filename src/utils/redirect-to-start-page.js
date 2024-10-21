import { isValidGrantType } from '../config/grant-types.js';
import { getInvalidGrantTypeResponse } from './get-invalid-response.js';
import { getGrantTypeFromUrl } from './get-info-from-url.js';

/**
 * Redirect to the start page of the eligibility checker.
 * @function redirectToStartPage
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} The response object.
 */
export default function redirectToStartPage(request, h) {
  const grantTypeId = getGrantTypeFromUrl(request.url);
  if (!isValidGrantType(grantTypeId)) {
    return getInvalidGrantTypeResponse(h);
  }
  return h.redirect(`/${grantTypeId}/start`);
}
