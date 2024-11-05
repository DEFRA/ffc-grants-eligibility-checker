import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import statusCodes, { OK } from '../../../constants/status-codes.js';
import * as Boom from '@hapi/boom';
import { startGrantStateMachines } from '../../../server.js';

// Create mock functions
const mockGetContext = jest.fn();

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

  const pageVariables = {
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
      grant: {
        startUrl: '/eligibility-checker/example-grant/start'
      },
      currentPageId: 'start',
      previousPageId: 'previous-page',
      nextPageId: 'next-page',
      grantTypeId: grantType.id
    }
  };

  const requestMock = {
    params: {
      grantType: grantType.id,
      page: 'start'
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockGetContext.mockReturnValue(pageVariables);
    startGrantStateMachines();
  });

  it('should create a view with structured page data', () => {
    viewGrantType(requestMock, mockH);

    expect(mockH.view).toHaveBeenCalledWith(
      `pages/${grantType.id}/start.njk`,
      expect.objectContaining(pageVariables)
    );
  });

  it('should return invalid grant type response when grant type is invalid', () => {
    expect(() => viewGrantType({ params: { grantType: 'invalid-grant' } }, mockH)).toThrow(
      Boom.notFound('Grant type not found')
    );
  });

  it('should return invalid page response when page is invalid', () => {
    expect(() =>
      viewGrantType({ params: { ...requestMock.params, page: 'invalid-page' } }, mockH)
    ).toThrow(Boom.notFound('Page not found'));
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
