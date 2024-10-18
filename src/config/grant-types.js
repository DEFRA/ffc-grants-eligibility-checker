import { app } from './app.js';

export const grantTypes = [
  {
    id: 'example-grant',
    name: 'Example Grant',
    description: 'Funding for example equipment',
    pages: [
      {
        id: 'start',
        name: 'Start',
        url: `${app.urlPrefix}/example-grant/start`,
        nextPageId: 'second-page',
        isCompleted: false
      }
      // {
      //     id: 'second-page',
      //     name: 'Second Page',
      //     url: '/eligibility-checker/example-grant/second-page',
      //     isCompleted: false
      // }
    ]
  }
];

/**
 * Given a grant type id, returns the associated grant type object.
 * @param {string} id - The grant type id.
 * @returns {object} - The grant type object, or undefined if the id is not valid.
 */
export function getGrantTypeById(id) {
  return grantTypes.find((grantType) => grantType.id === id);
}

/**
 * Given a grant type id, returns true if the id is valid, false otherwise.
 * @param {string} id - The grant type id.
 * @returns {boolean} - True if the id is valid, false otherwise.
 */
export function isValidGrantType(id) {
  return grantTypes.some((grantType) => grantType.id === id);
}

/**
 * Given a grant type and a page id, returns true if the page id is
 * present in the grant type's pages array, false otherwise.
 * @param {object} grantType - The grant type object.
 * @param {string} pageId - The id of the page in question.
 * @returns {boolean} - True if the page id is valid, false otherwise.
 */
export function isValidGrantPage(grantType, pageId) {
  return grantType.pages.some((page) => page.id === pageId);
}
