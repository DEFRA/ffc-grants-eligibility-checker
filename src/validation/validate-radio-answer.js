import statusCodes, { OK } from '../constants/status-codes.js';

/**
 * Checks if a page has a required radio answer before sending an event to the grant type machine
 * @param {object} grantTypeMachineService - The grant type machine service
 * @param {object} request - The request object
 * @param {object} h - The response toolkit
 * @returns {object} The response object
 */
export const validateRadioAnswer = (grantTypeMachineService, request, h) => {
  const { currentPageId, answer } = request.payload;

  if (!answer) {
    grantTypeMachineService.send({
      type: 'UPDATE_STATE',
      currentPageId,
      errors: {
        [currentPageId]: {
          key: `${currentPageId}Required`,
          message: 'Select an option'
        }
      }
    });

    return h
      .response({
        status: 'error',
        currentPageId
      })
      .code(statusCodes(OK));
  } else {
    return null;
  }
};
