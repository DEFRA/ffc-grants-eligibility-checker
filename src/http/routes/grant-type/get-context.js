import { app } from '../../../config/app.js';
import { generateConfirmationId } from '../../../utils/template-utils.js';
import { pages } from '../../../config/machines/locale/en.js';

/**
 * Returns the context for hapi view
 *  @param {object} grantTypeId - The grant type id
 * @param {object} meta - The state's context object
 * @returns {object} - The context object
 */
export function getContext(grantTypeId, meta) {
  return {
    pageTitle: `${app.siteTitle} - ${meta.currentPageId}`,
    showTimeout: true,
    surveyLink: `${app.surveyLink}`,
    sessionTimeoutInMin: `${app.sessionTimeoutInMins}`,
    timeoutPath: `${app.timeoutPath}`,
    cookiesPolicy: {
      confirmed: false,
      analytics: true
    },
    meta: {
      localisation: { ...pages[meta.currentPageId] },
      ...meta,
      grantTypeId,
      generateConfirmationId
    }
  };
}
