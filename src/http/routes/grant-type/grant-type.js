import { getContext } from './get-context.js';
import statusCodes, { OK } from '../../../constants/status-codes.js';
import redirectToStartPage from '../../../utils/redirect-to-start-page.js';
import { grantIdToMachineServiceMap } from '../../../config/machines/index.js';
import * as Boom from '@hapi/boom';

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const { grantType, page } = request.params;
  console.log(`viewGrantType grantType: ${grantType}, ${page}`);

  const grantTypeMachineService = grantIdToMachineServiceMap[grantType];
  if (grantTypeMachineService) {
    console.debug('viewGrantType: Grant is valid');

    const stateMeta = grantTypeMachineService.state.meta[`exampleGrantMachine.${page}`];

    if (stateMeta) {
      console.debug(
        `viewGrantType: state ${page} is valid with meta: ${JSON.stringify(stateMeta, null, 2)}`
      );

      return h.view(
        `pages/${grantType}/${page}.njk`,
        getContext(grantType, {
          currentPageId: grantTypeMachineService.state.context.currentPageId,
          nextPageId: stateMeta?.nextPageId,
          previousPageId: stateMeta?.previousPageId
        })
      );
    }
    console.log(`viewGrantType: state for ${page} is invalid`);
    throw Boom.notFound('Page not found');
  }

  console.log('viewGrantType: Grant type is invalid');
  throw Boom.notFound('Grant type not found');
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
