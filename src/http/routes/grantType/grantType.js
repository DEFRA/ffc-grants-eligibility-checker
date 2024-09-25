import { v4 as uuid } from "uuid";

let grantType;
const _200_OK = 200;

/**
 * Creates a grant type object with a unique ID, title, and description.
 * @param {string} title - The title of the grant type.
 * @param {string} description - The description of the grant type.
 * @returns {object} - The created grant type object.
 */
export const addGrantType = (title, description) => {
  grantType = {
    id: uuid(),
    title,
    description,
  };

  return grantType;
};

/**
 * Retrieves the grant type.
 * @param {object} request - The request object.
 * @param {object} h - The response toolkit.
 * @returns {object} - The view with the grant type information.
 */
export const getGrantType = (request, h) => {
  const context = {
    siteTitle: "FFC Grants Eligibility Checker",
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

  return h.view("layout.njk", context);
};

/**
 * Represents the routes configuration for handling different grant types.
 * @type {Array<object>}
 */
export const routes = [
  {
    method: "GET",
    path: "/{grantType}",
    handler: getGrantType,
  },
  {
    method: "POST",
    path: "/{grantType}",
    handler: addGrantType.bind(this, "Test Title", "Test Description"),
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
