import { getContext } from './get-context.js';
import statusCodes, { OK } from '../../../constants/status-codes.js';
import {
  getInvalidGrantTypeResponse,
  getInvalidPageResponse
} from '../../../utils/get-invalid-response.js';
import redirectToStartPage from '../../../utils/redirect-to-start-page.js';
import { grantIdToMachineServiceMap } from '../../../config/machines/index.js';

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const { grantTypeId, pageId } = request.params;
  console.log(`viewGrantType grantTypeId: ${grantTypeId}`);
  console.log(`viewGrantType pageId: ${pageId}`);

  const grantTypeMachineService = grantIdToMachineServiceMap[grantTypeId];
  if (grantTypeMachineService) {
    console.log('viewGrantType: Grant is valid');

    const stateMeta = grantTypeMachineService.state.meta[`exampleGrantMachine.${pageId}`];

    if (stateMeta) {
      console.log(`viewGrantType: state ${pageId} is valid`);
      console.log(`viewGrantType ${pageId} state meta: ${JSON.stringify(stateMeta, null, 2)}`);

      return h.view(
        `pages/${grantTypeId}/${pageId}.njk`,
        getContext(grantTypeId, {
          currentPageId: grantTypeMachineService.state.context.currentPageId,
          nextPageId: stateMeta?.nextPageId,
          previousPageId: stateMeta?.previousPageId
        })
      );
    }
    console.log(`viewGrantType: state for ${pageId} is invalid`);
    return getInvalidPageResponse(h);
  }

  console.log('viewGrantType: Grant is invalid');
  return getInvalidGrantTypeResponse(h);
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
    path: `/eligibility-checker/{grantType}`,
    handler: redirectToStartPage
  },
  {
    method: 'GET',
    path: `/eligibility-checker/{grantType}/{page}`,
    handler: viewGrantType
  }
];
