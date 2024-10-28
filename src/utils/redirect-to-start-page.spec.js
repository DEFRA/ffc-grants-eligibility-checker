// redirect-to-start-page.spec.js
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import statusCodes, { NOT_FOUND } from '../constants/status-codes.js';

const mockIsValidGrantType = jest.fn();
const mockGetInvalidGrantTypeResponse = jest.fn();

jest.unstable_mockModule('../config/grant-types.js', () => ({
  isValidGrantType: mockIsValidGrantType
}));

jest.unstable_mockModule('./get-invalid-response.js', () => ({
  getInvalidGrantTypeResponse: mockGetInvalidGrantTypeResponse
}));

const { default: redirectToStartPage } = await import('./redirect-to-start-page.js');

describe('redirectToStartPage', () => {
  let mockH;

  beforeEach(() => {
    jest.resetAllMocks();

    mockH = {
      redirect: jest.fn(),
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    mockGetInvalidGrantTypeResponse.mockImplementation(() =>
      mockH.response('Grant type not found').code(statusCodes(NOT_FOUND))
    );
  });

  it('redirects to start page with valid grant type', async () => {
    const request = {
      params: { grantType: 'valid-grant-type' },
      url: { pathname: '/valid-grant-type' }
    };
    mockIsValidGrantType.mockReturnValue(true);

    await redirectToStartPage(request, mockH);
    expect(mockH.redirect).toHaveBeenCalledTimes(1);
    expect(mockH.redirect).toHaveBeenCalledWith('/valid-grant-type/start');
  });

  it('returns invalid grant type response with invalid grant type', async () => {
    const request = {
      params: { grantType: 'invalid-grant-type' },
      url: { pathname: '/invalid-grant-type' }
    };
    mockIsValidGrantType.mockReturnValue(false);

    const result = await redirectToStartPage(request, mockH);
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledTimes(1);
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledWith(mockH);
    expect(mockH.response).toHaveBeenCalledWith('Grant type not found');
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(NOT_FOUND));
    expect(result).toBe(mockH);
  });
});
