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
  console.log(`viewGrantType grantTypeId: ${grantTypeId}`);

  if (!isValidGrantType(grantTypeId)) {
    return getInvalidGrantTypeResponse(h);
  }

  console.log('viewGrantType: Grant is valid');

  const grantType = getGrantTypeById(grantTypeId);
  console.log(`viewGrantType grantType: ${JSON.stringify(grantType)}`);

  const pageId = request.params.page;

  console.log(`viewGrantType pageId: ${pageId}`);

  if (!isValidGrantPage(grantType, pageId)) {
    return getInvalidPageResponse(h);
  }

  console.log('viewGrantType: Page is valid');

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
