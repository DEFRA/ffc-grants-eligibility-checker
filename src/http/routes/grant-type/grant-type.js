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
import { getContext } from './get-context.js';
import statusCodes, { OK } from '../../../constants/status-codes.js';

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const grantTypeId = request.params.grantType;

  if (!isValidGrantType(grantTypeId)) {
    return getInvalidGrantTypeResponse(h);
  }
  const grantType = getGrantTypeById(grantTypeId);
  const pageId = request.params.page;
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
    path: '/healthy',
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
    path: '/healthz',
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
    path: `/{grantType}`,
    handler: redirectToStartPage
  },
  {
    method: 'GET',
    path: `/{grantType}/{page}`,
    handler: viewGrantType
  }
];
