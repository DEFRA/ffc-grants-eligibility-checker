import { getContext } from './get-context.js';
import statusCodes, { OK } from '../../../constants/status-codes.js';
import { getInvalidGrantTypeResponse } from "../../../utils/get-invalid-response.js";
import {
  getGrantTypeFromUrl,
  getPageFromUrl,
} from "../../../utils/get-info-from-url.js";
import redirectToStartPage from "../../../utils/redirect-to-start-page.js";
import getContext from "./get-context.js";
import statusCodes, { OK } from "../../../constants/status-codes.js";
import { grantIdToMachineServiceMap } from "../../../config/machines/index.js";
import * as Boom from "@hapi/boom";

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const grantTypeId = getGrantTypeFromUrl(request.url);

  console.log(`viewGrantType grantTypeId: ${grantTypeId}`);

  const pageId = getPageFromUrl(request.url);

  const grantTypeMachineService = grantIdToMachineServiceMap[grantTypeId];
  if (grantTypeMachineService) {

    console.log('viewGrantType: Grant is valid');

    const stateMeta =
      grantTypeMachineService.state.meta[`exampleGrantMachine.${pageId}`];

    if (stateMeta) {

      console.log(`viewGrantType: state ${pageId} is valid`);
      console.log(`viewGrantType ${pageId} state meta: ${stateMeta}`);
      
      return h.view(
        `pages/${grantTypeId}/${pageId}.njk`,
        getContext(grantTypeId, {
          currentPageId: grantTypeMachineService.state.context.currentPageId,
          nextPageId: stateMeta?.nextPageId,
          previousPageId: stateMeta?.previousPageId,
        }),
      );
    }
    console.log(`viewGrantType: state ${pageId} is invalid`);
    throw Boom.notFound("Resource not found");
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
