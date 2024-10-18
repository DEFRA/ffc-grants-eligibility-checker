import { routes as grantType } from './grant-type/grant-type.js';

/**
 * A function that returns all the route definitions
 * @returns {object[]} An array of route definitions
 */
export function getRouteDefinitions() {
  return [...grantType];
}
