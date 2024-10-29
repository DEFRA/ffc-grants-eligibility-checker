// redirect-to-start-page.spec.js
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import statusCodes, { NOT_FOUND } from '../constants/status-codes.js';

const mockGetInvalidGrantTypeResponse = jest.fn();

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
      params: { grantTypeId: 'example-grant' }
    };

    await redirectToStartPage(request, mockH);
    expect(mockH.redirect).toHaveBeenCalledTimes(1);
    expect(mockH.redirect).toHaveBeenCalledWith('/eligibility-checker/example-grant/start');
  });

  it('returns invalid grant type response with invalid grant type', async () => {
    const request = {
      params: { grantTypeId: 'invalid-grant-type' }
    };

    const result = await redirectToStartPage(request, mockH);
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledTimes(1);
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledWith(mockH);
    expect(mockH.response).toHaveBeenCalledWith('Grant type not found');
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(NOT_FOUND));
    expect(result).toBe(mockH);
  });
});
