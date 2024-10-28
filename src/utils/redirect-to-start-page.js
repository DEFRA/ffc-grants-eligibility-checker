import { grantIdToMachineServiceMap } from '../config/machines/index.js';
import { getGrantTypeFromUrl } from './get-info-from-url.js';
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
  const grantTypeId = getGrantTypeFromUrl(request.url);
  if (grantIdToMachineServiceMap[grantTypeId]) {
    return h.redirect(`/eligibility-checker/${grantTypeId}/start`);
  }
  return getInvalidGrantTypeResponse(h);
}
