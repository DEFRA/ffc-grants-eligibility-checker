/**
 * Splits a URL into its parts.
 * @param url - The URL to split.
 * @returns {string[]} - The parts of the URL.
 */
function splitUrl(url) {
  return url.pathname.split('/').filter(Boolean);
}

/**
 * Given a URL, returns the grant type id extracted from the URL.
 * @param {URL} url - The URL to extract the grant type id from.
 * @returns {string} - The grant type id.
 */
export function getGrantTypeFromUrl(url) {
  const parts = splitUrl(url);
  if (parts[0] === 'eligibility-checker') {
    parts.shift();
  }
  return parts[0];
}

/**
 * Given a URL, returns the page id extracted from the URL.
 * @param {URL} url - The URL to extract the page id from.
 * @returns {string} - The page id.
 */
export function getPageFromUrl(url) {
  const parts = splitUrl(url);
  if (parts[0] === 'eligibility-checker') {
    parts.shift();
  }
  return parts.pop();
}
