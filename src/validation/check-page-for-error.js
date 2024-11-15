import { validationMap } from './validation-map.js';

/**
 * Checks if a page has a required radio answer before sending an event to the grant type machine
 * @param {object} grantTypeMachineService - The grant type machine service
 * @param {object} request - The request object
 * @param {object} h - The response toolkit
 * @returns {object} The response object || null
 */
export const checkPageForError = (grantTypeMachineService, request, h) => {
  const { currentPageId, questionType, answer } = request.payload;

  const validate = validationMap[questionType];

  if (validate) {
    return validate(grantTypeMachineService, request, h, currentPageId, answer);
  }

  return null;
};
