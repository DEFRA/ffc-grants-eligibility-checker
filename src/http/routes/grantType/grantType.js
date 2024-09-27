const _200_OK = 200;

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const viewGrantType = (request, h) => {
  const lastIndexOfSlash = request.url.toString().lastIndexOf("/");
  const grantType = request.url.toString().substring(lastIndexOfSlash + 1);
  const context = {
    siteTitle: `FFC Grants Eligibility Checker - ${grantType}`,
    urlPrefix: "/eligibility-checker",
    showTimeout: true,
    surveyLink: "https://example.com/survey",
    sessionTimeoutInMin: 15,
    timeoutPath: "/timeout",
    cookiesPolicy: {
      confirmed: false,
      analytics: true,
    },
  };
  console.log(`context=${JSON.stringify(context)}`);
  return h.view("layout.njk", context);
};

/**
 * Represents the routes configuration for handling different grant types.
 * @type {Array<object>}
 */
export const routes = [
  {
    method: "GET",
    path: "/eligibility-checker/{grantType}",
    handler: viewGrantType,
  },
  {
    method: "GET",
    path: "/healthy",
    /**
     * Return 200 OK
     * @param {object} _request incoming request
     * @param {object} h handler
     * @returns {string} http code 200
     */
    handler: (_request, h) => h.response("ok").code(_200_OK),
  },
  {
    method: "GET",
    path: "/healthz",
    /**
     * Return 200 OK
     * @param {object} _request incoming request
     * @param {object} h handler
     * @returns {string} http code 200
     */
    handler: (_request, h) => h.response("ok").code(_200_OK),
  },
];
