import { describe, it, jest, expect } from '@jest/globals';
import { configureServer } from '../../../../src/server';
import { JSDOM } from 'jsdom';

jest.setTimeout(10000);

describe('Start Page', () => {
  let server;
  let dom;
  let cookie;

  beforeEach(async () => {
    server = await configureServer();
    await server.start();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe('response', () => {
    it('should redirect to starsert page successfully', async () => {
      const redirectResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant'
      });

      cookie = redirectResponse.headers['set-cookie'][0].split(';')[0];

      expect(redirectResponse.statusCode).toBe(302);
      expect(redirectResponse.statusMessage).toBe('Found');
      expect(redirectResponse.headers.location).toBe('/eligibility-checker/example-grant/start');

      const startPageResponse = await server.inject({
        method: 'GET',
        url: redirectResponse.headers.location,
        headers: {
          cookie
        }
      });

      expect(startPageResponse.statusCode).toBe(200);
    });
  });

  describe('interaction', () => {
    beforeEach(async () => {
      const redirectResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant'
      });

      cookie = redirectResponse.headers['set-cookie'][0].split(';')[0];

      const startPageResponse = await server.inject({
        method: 'GET',
        url: redirectResponse.headers.location,
        headers: {
          cookie
        }
      });

      dom = new JSDOM(startPageResponse.payload, {
        runScripts: 'dangerously',
        url: 'https://checker-domain/eligibility-checker/example-grant'
      });

      // Mock `fetch` in the JSDOM window
      dom.window.fetch = jest.fn().mockResolvedValue({
        json: async () => ({ nextPageId: 'country' })
      });
    });
    it('makes a NEXT transition call when the start button is clicked', async () => {
      const startButton = dom.window.document.querySelector('.govuk-button--start');
      expect(startButton).not.toBeNull();

      // Simulate the click on the start button
      startButton.click();

      // Verify fetch was called with correct parameters for "BACK" event
      expect(dom.window.fetch).toHaveBeenCalledWith(
        '/eligibility-checker/example-grant/transition',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            event: 'NEXT',
            currentPageId: 'start',
            nextPageId: 'country',
            previousPageId: ''
          })
        })
      );
    });
  });

  describe('snapshot', () => {
    it('should match snapshot', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/start'
      });
      expect(response.payload).toMatchSnapshot();
    });
  });
});
