import { app } from '../../../config/app.js';

/**
 * Returns the context for hapi view
 * @param {object} grantType - The grant type object
 * @returns {object} - The context object
 */
export function getContext(grantType) {
  return {
    siteTitle: `${app.siteTitle} - ${grantType.id}`,
    showTimeout: true,
    surveyLink: `${app.surveyLink}`,
    sessionTimeoutInMin: `${app.sessionTimeoutInMins}`,
    timeoutPath: `${app.timeoutPath}`,
    cookiesPolicy: {
      confirmed: false,
      analytics: true
    },
    grantType
  };
}
