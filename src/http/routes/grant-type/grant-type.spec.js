import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import statusCodes, { OK } from '../../../constants/status-codes.js';

// Create mock functions
const mockGetGrantTypeById = jest.fn();
const mockIsValidGrantType = jest.fn();
const mockIsValidGrantPage = jest.fn();
const mockGetInvalidGrantTypeResponse = jest.fn();
const mockGetInvalidPageResponse = jest.fn();

jest.unstable_mockModule('../../../config/grant-types.js', () => ({
  isValidGrantType: mockIsValidGrantType,
  getGrantTypeById: mockGetGrantTypeById,
  isValidGrantPage: mockIsValidGrantPage
}));

jest.unstable_mockModule('../../../utils/get-invalid-response.js', () => ({
  getInvalidGrantTypeResponse: mockGetInvalidGrantTypeResponse,
  getInvalidPageResponse: mockGetInvalidPageResponse
}));

const { routes, viewGrantType } = await import('./grant-type.js');

describe('Grant Type Tests', () => {
  const mockH = {
    view: jest.fn(),
    response: jest.fn().mockReturnThis(),
    code: jest.fn()
  };

  const grantType = {
    id: 'example-grant'
  };

  const requestMock = {
    url: `/eligibility-checker/${grantType.id}/start`,
    params: {
      grantType: grantType.id,
      page: 'start'
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsValidGrantType.mockReturnValue(true);
    mockGetGrantTypeById.mockReturnValue(grantType);
    mockIsValidGrantPage.mockReturnValue(true);
  });

  it('should get view with requested grant type and page', () => {
    viewGrantType(requestMock, mockH);

    expect(mockH.view).toHaveBeenCalledWith(
      `pages/${grantType.id}/start.njk`,
      expect.objectContaining({
        siteTitle: 'FFC Grants Eligibility Checker - example-grant'
      })
    );
  });

  it('should return invalid grant type response when grant type is invalid', () => {
    mockIsValidGrantType.mockReturnValue(false);
    mockGetInvalidGrantTypeResponse.mockReturnValue('Invalid Grant Type');

    const result = viewGrantType(requestMock, mockH);

    expect(result).toBe('Invalid Grant Type');
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledWith(mockH);
  });

  it('should return invalid page response when page is invalid', () => {
    mockIsValidGrantPage.mockReturnValue(false);
    mockGetInvalidPageResponse.mockReturnValue('Invalid Page');

    const result = viewGrantType(requestMock, mockH);

    expect(result).toBe('Invalid Page');
    expect(mockGetInvalidPageResponse).toHaveBeenCalledWith(mockH);
  });

  it('should return 200 for GET healthy handler', () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    routes[0].handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith('ok');
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });

  it('should return 200 for GET healthz handler', () => {
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    routes[1].handler({}, mockH);

    expect(mockH.response).toHaveBeenCalledWith('ok');
    expect(mockH.code).toHaveBeenCalledWith(statusCodes(OK));
  });
});
