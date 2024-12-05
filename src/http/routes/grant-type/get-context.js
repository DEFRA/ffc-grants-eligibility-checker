import { appConfig } from '../../../config/index.js';
import { generateConfirmationId } from '../../../utils/template-utils.js';

/**
 * Returns the context for hapi view
 *  @param {object} grantTypeId - The grant type id
 * @param {object} meta - The state's context object
 * @returns {object} - The context object
 */
export function getContext(grantTypeId, meta) {
  return {
    showTimeout: true,
    surveyLink: `${appConfig.surveyLink}`,
    sessionTimeoutInMin: `${appConfig.sessionTimeoutInMins}`,
    timeoutPath: `${appConfig.timeoutPath}`,
    cookiesPolicy: {
      confirmed: false,
      analytics: true
    },
    meta: {
      ...meta,
      grantTypeId,
      generateConfirmationId
    }
  };
}
