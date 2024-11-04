// redirect-to-start-page.spec.js
import * as Boom from '@hapi/boom';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

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
  });

  it('redirects to start page with valid grant type', () => {
    const request = {
      params: { grantType: 'example-grant' }
    };

    redirectToStartPage(request, mockH);
    expect(mockH.redirect).toHaveBeenCalledTimes(1);
    expect(mockH.redirect).toHaveBeenCalledWith('/eligibility-checker/example-grant/start');
  });

  it('throws invalid grant type error', () => {
    const request = {
      params: { grantType: 'invalid-grant-type' }
    };

    expect(() => redirectToStartPage(request, mockH)).toThrow(
      Boom.notFound('Grant type not found')
    );
  });
});
