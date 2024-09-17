import { routes as grantType } from './grantType/grantType.js'

/**
 * A function that returns all the route definitions
 * @returns {object[]} An array of route definitions
 */
export function getRouteDefinitions () {
  return [
    ...grantType
  ]
}
