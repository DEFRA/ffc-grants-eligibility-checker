/**
 * Returns the context for hapi view
 * @param {object} grantType - The grant type object
 * @returns {object} - The context object
 */
export default function getContext(grantType) {
  return {
    siteTitle: `${process.env.SITE_TITLE} - ${grantType.id}`,
    urlPrefix: process.env.URL_PREFIX,
    showTimeout: true,
    surveyLink: process.env.SURVEY_LINK,
    sessionTimeoutInMin: process.env.SESSION_TIMEOUT_IN_MINS,
    timeoutPath: process.env.TIMEOUT_PATH,
    cookiesPolicy: {
      confirmed: false,
      analytics: true,
    },
    grantType,
  };
}
