import { v4 as uuid } from 'uuid'

let grantType

/**
 * Add a new grant type
 * @param {string} title - Title of the grant
 * @param {string} description - Description of the grant
 * @returns {object} The new grant type object
 */
export const addGrantType = (title, description) => {
  grantType = {
    id: uuid(),
    title,
    description
  }

  return grantType
}

/**
 * Get the current grant type
 * @returns {object} The current grant type object
 */
export const getGrantType = () => grantType

export const routes = [
  {
    method: 'GET',
    path: '/{grantType}',
    handler: getGrantType
  },
  {
    method: 'POST',
    path: '/{grantType}',
    handler: addGrantType.bind(this, 'Test Title', 'Test Description')
  }
]
