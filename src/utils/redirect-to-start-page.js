import * as Boom from '@hapi/boom';
import { grantIdToMachineServiceMap } from '../config/machines/index.js';

/**
 * Redirect to the start page of the eligibility checker.
 * @function redirectToStartPage
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} The response object.
 */
export default function redirectToStartPage(request, h) {
  const { grantType } = request.params;
  console.log(`redirectToStartPage grantType: ${grantType}`);
  if (grantIdToMachineServiceMap[grantType]) {
    return h.redirect(`/eligibility-checker/${grantType}/start`);
  }
  console.log('viewGrantType: Grant type is invalid');
  throw Boom.notFound('Grant type not found');
}
