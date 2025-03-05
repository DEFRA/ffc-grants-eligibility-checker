import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import statusCodes, { OK } from '../../../constants/status-codes.js';
import * as Boom from '@hapi/boom';
import { generateConfirmationId } from '../../../utils/template-utils.js';

jest.mock('../../../notification/handle-submission.js');

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
    cookiesPolicy: { analytics: true, confirmed: false },
    meta: {
      templateId: 'start',
      currentPageId: 'start',
      grant: { startUrl: '/eligibility-checker/example-grant/start' },
      grantTypeId: grantType.id,
      items: undefined,
      nextPageId: 'country',
      hasErrors: false,
      errors: undefined,
      generateConfirmationId,
      serviceStartUrl: '/eligibility-checker/example-grant/start',
      serviceTitle: 'Example Grant'
    },
    sessionTimeoutInMin: '60',
    showTimeout: true,
    surveyLink: 'https://example.com/survey',
    timeoutPath: '/timeout'
  };

  const requestMock = {
    params: {
      grantType: grantType.id,
      page: 'start'
    },
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a view with structured page data', () => {
    viewGrantType(requestMock, mockH);

    expect(mockH.view).toHaveBeenCalledWith(
      `pages/start.njk`,
      expect.objectContaining(pageVariables)
    );
  });

  it('should return invalid grant type response when grant type is invalid', () => {
    expect(() =>
      viewGrantType(
        {
          params: { grantType: 'invalid-grant' },
          yar: {
            get: jest.fn(),
            set: jest.fn()
          }
        },
        mockH
      )
    ).toThrow(Boom.notFound('Invalid grantType: "invalid-grant"'));
  });

  it('should return invalid page response when page is invalid', () => {
    expect(() =>
      viewGrantType(
        {
          params: { ...requestMock.params, page: 'invalid-page' },
          yar: {
            get: jest.fn(),
            set: jest.fn()
          }
        },
        mockH
      )
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
