/**
 * Given a URL, returns the grant type id extracted from the URL.
 * @param {string|URL} url - The URL to extract the grant type id from.
 * @returns {string} - The grant type id.
 */
export function getGrantTypeFromUrl(url) {
  return url.toString().match(/\/eligibility-checker\/([^/]+)/)[1];
}

/**
 * Given a URL, returns the page id extracted from the URL.
 * @param {string|URL} url - The URL to extract the page id from.
 * @returns {string} - The page id.
 */
export function getPageFromUrl(url) {
  return url.toString().split("/").pop();
}
