import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import statusCodes, { OK } from '../../../constants/status-codes.js';

// Create mock functions
const mockGetInvalidGrantTypeResponse = jest.fn();
const mockGetInvalidPageResponse = jest.fn();
const mockGetContext = jest.fn();

jest.unstable_mockModule('../../../utils/get-invalid-response.js', () => ({
  getInvalidGrantTypeResponse: mockGetInvalidGrantTypeResponse,
  getInvalidPageResponse: mockGetInvalidPageResponse
}));
jest.unstable_mockModule('./get-context.js', () => ({
  getContext: mockGetContext
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
    params: {
      grantType: grantType.id,
      page: 'start'
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockGetContext.mockReturnValue({
      siteTitle: `FFC Grants Eligibility Checker - start`,
      urlPrefix: '/eligibility-checker',
      showTimeout: true,
      surveyLink: 'https://example.com/survey',
      sessionTimeoutInMin: 15,
      timeoutPath: '/timeout',
      cookiesPolicy: {
        confirmed: false,
        analytics: true
      },
      meta: {
        currentPageId: 'start',
        previousPageId: 'previous-page',
        nextPageId: 'next-page',
        grantTypeId: grantType.id
      }
    });
  });

  it('should get view with requested grant type and page', () => {
    viewGrantType(requestMock, mockH);

    expect(mockH.view).toHaveBeenCalledWith(
      `pages/${grantType.id}/start.njk`,
      expect.objectContaining({
        siteTitle: 'FFC Grants Eligibility Checker - start'
      })
    );
  });

  it('should return invalid grant type response when grant type is invalid', () => {
    mockGetInvalidGrantTypeResponse.mockReturnValue('Invalid Grant Type');

    const result = viewGrantType({ params: { grantType: 'invalid-grant' } }, mockH);

    expect(result).toBe('Invalid Grant Type');
    expect(mockGetInvalidGrantTypeResponse).toHaveBeenCalledWith(mockH);
  });

  it('should return invalid page response when page is invalid', () => {
    mockGetInvalidPageResponse.mockReturnValue('Invalid Page');

    const result = viewGrantType(
      { params: { ...requestMock.params, page: 'invalid-page' } },
      mockH
    );

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
