import { getContext } from './get-context.js';
import statusCodes, { OK } from '../../../constants/status-codes.js';
import redirectToStartPage from '../../../utils/redirect-to-start-page.js';
import { grantIdToMachineServiceMap } from '../../../config/machines/index.js';
import * as Boom from '@hapi/boom';
import { getOptions } from '../../../utils/template-utils.js';

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const { grantType, page } = request.params;
  console.log(`viewGrantType grantType: ${grantType}, page: ${page}`);

  const grantTypeMachineService = grantIdToMachineServiceMap[grantType];
  if (grantTypeMachineService) {
    console.debug('viewGrantType: Grant is valid');

    const stateMeta = grantTypeMachineService.state.meta[`exampleGrantMachine.${page}`];

    if (stateMeta) {
      const userAnswers = grantTypeMachineService.state.context.userAnswers;
      const context = getContext(grantType, {
        ...stateMeta,
        currentPageId: grantTypeMachineService.state.context.currentPageId,
        items: getOptions(userAnswers[page], stateMeta)
      });

      console.debug(
        `viewGrantType: state ${page} is valid with context: ${JSON.stringify(context, null, 2)}`
      );
      return h.view(`pages/${stateMeta.templateId}.njk`, context);
    }
    console.warn(`viewGrantType: state for ${page} is invalid`);
    throw Boom.notFound('Page not found');
  }

  console.warn('viewGrantType: Grant type is invalid');
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
