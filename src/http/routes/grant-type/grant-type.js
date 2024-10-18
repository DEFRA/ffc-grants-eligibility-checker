import { app } from '../../../config/app.js';
import {
  isValidGrantType,
  getGrantTypeById,
  isValidGrantPage
} from '../../../config/grant-types.js';
import redirectToStartPage from '../../../utils/redirect-to-start-page.js';
import {
  getInvalidGrantTypeResponse,
  getInvalidPageResponse
} from '../../../utils/get-invalid-response.js';
import { getGrantTypeFromUrl, getPageFromUrl } from '../../../utils/get-info-from-url.js';
import { getContext } from './get-context.js';
import statusCodes, { OK } from '../../../constants/status-codes.js';

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const grantTypeId = getGrantTypeFromUrl(request.url);

  if (!isValidGrantType(grantTypeId)) {
    return getInvalidGrantTypeResponse(h);
  }
  const grantType = getGrantTypeById(grantTypeId);
  const pageId = getPageFromUrl(request.url);
  if (!isValidGrantPage(grantType, pageId)) {
    return getInvalidPageResponse(h);
  }

  return h.view(`pages/${grantType.id}/${pageId}.njk`, getContext(grantType));
};

/**
 * Represents the routes configuration for handling different grant types.
 * @type {Array<object>}
 */
export const routes = [
  {
    method: 'GET',
    path: `${app.urlPrefix}/healthy`,
    /**
     * Return 200 OK
     * @param {object} _request incoming request
     * @param {object} h handler
     * @returns {string} http code 200
     */
    handler: (_request, h) => h.response('ok').code(statusCodes(OK))
  },
  {
    method: 'GET',
    path: `${app.urlPrefix}/healthz`,
    /**
     * Return 200 OK
     * @param {object} _request incoming request
     * @param {object} h handler
     * @returns {string} http code 200
     */
    handler: (_request, h) => h.response('ok').code(statusCodes(OK))
  },
  {
    method: 'GET',
    path: `${app.urlPrefix}/{grantType}`,
    handler: redirectToStartPage
  },
  {
    method: 'GET',
    path: `${app.urlPrefix}/{grantType}/{page*}`,
    handler: viewGrantType
  }
];
