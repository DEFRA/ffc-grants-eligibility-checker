import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { configureServer } from '../../../../src/server';
import { JSDOM } from 'jsdom';

jest.setTimeout(30000);

describe('Consent Page', () => {
  let server;
  let dom;

  beforeEach(async () => {
    server = await configureServer();

    // Initial navigation setup to "country" page
    await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'start',
        nextPageId: 'country'
      }
    });
    // Load the "country" page with a base URL
    await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/country'
    });
    // Transition to the "consent" page
    await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'country',
        nextPageId: 'consent'
      }
    });
    // Load the "consent" page with a base URL
    await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/consent'
    });
    // Transition to the "confirmation" page
    await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'consent',
        nextPageId: 'confirmation'
      }
    });
    // Load the "consent" page with a base URL
    const confirmationPageResponse = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/confirmation'
    });

    dom = new JSDOM(confirmationPageResponse.payload, {
      runScripts: 'dangerously'
    });

    // Mock `fetch` in the JSDOM window
    dom.window.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ previousPageId: 'consent' })
    });
  });

  afterEach(() => {
    server.stop();
  });

  describe('response', () => {
    it('should return 200 on successfull page load', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/confirmation'
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('snapshot', () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    });

    it('should match snapshot', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/confirmation'
      });
      expect(response.payload).toMatchSnapshot();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
