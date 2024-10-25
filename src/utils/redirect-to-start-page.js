import { isValidGrantType } from '../config/grant-types.js';
import { getInvalidGrantTypeResponse } from './get-invalid-response.js';

/**
 * Redirect to the start page of the eligibility checker.
 * @function redirectToStartPage
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} The response object.
 */
export default function redirectToStartPage(request, h) {
  console.log('redirectToStartPage');
  const grantTypeId = request.params.grantType;
  if (!isValidGrantType(grantTypeId)) {
    return getInvalidGrantTypeResponse(h);
  }
  return h.redirect(`/${grantTypeId}/start`);
}
