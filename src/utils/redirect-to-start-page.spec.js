// redirect-to-start-page.spec.js
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

  it('redirects to start page with valid grant type', async () => {
    const request = {
      params: { grantType: 'valid-grant-type' },
      url: { pathname: '/valid-grant-type' }
    };

    await redirectToStartPage(request, mockH);
    expect(mockH.redirect).toHaveBeenCalledTimes(1);
    expect(mockH.redirect).toHaveBeenCalledWith('/eligibility-checker/valid-grant-type/start');
  });
});
