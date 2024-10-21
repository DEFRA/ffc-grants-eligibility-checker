import { getGrantTypeFromUrl, getPageFromUrl } from './get-info-from-url';

const url = { pathname: '/example-grant/example-page' };

describe('getGrantTypeFromUrl', () => {
  it('should extract grant type id from a string URL', () => {
    expect(getGrantTypeFromUrl(url)).toBe('example-grant');
  });
});

describe('getPageFromUrl', () => {
  it('should extract page id from a string URL', () => {
    expect(getPageFromUrl(url)).toBe('example-page');
  });
});
