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
    const consentPageResponse = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/consent'
    });

    dom = new JSDOM(consentPageResponse.payload, {
      runScripts: 'dangerously'
    });

    // Mock `fetch` in the JSDOM window
    dom.window.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ previousPageId: 'country', nextPageId: 'confirmation' })
    });
  });

  afterEach(() => {
    server.stop();
  });

  describe('response', () => {
    it('should return 200 on successfull page load', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/consent'
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('interaction', () => {
    it('makes a BACK transition call when the back button is clicked', async () => {
      const backButton = dom.window.document.querySelector('.govuk-back-link');
      expect(backButton).not.toBeNull();

      // Simulate the click on the back button
      backButton.click();

      // Verify fetch was called with correct parameters for "BACK" event
      expect(dom.window.fetch).toHaveBeenCalledWith(
        '/eligibility-checker/example-grant/transition',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            event: 'BACK',
            nextPageId: 'confirmation',
            previousPageId: 'country'
          })
        })
      );
    });

    it('makes a NEXT transition call when selected CONSENT_OPTIONAL and the continue button is clicked', async () => {
      // Select the radio button based on the provided selector
      const radioOption = dom.window.document.querySelector('#consent');
      radioOption.checked = true;

      const continueButton = dom.window.document.querySelector('.govuk-button');
      expect(continueButton).not.toBeNull();

      // Simulate the click on the continue button
      continueButton.click();

      // Verify fetch was called with correct parameters for "NEXT" event
      expect(dom.window.fetch).toHaveBeenCalledWith(
        '/eligibility-checker/example-grant/transition',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            event: 'NEXT',
            currentPageId: 'consent',
            nextPageId: 'confirmation',
            previousPageId: 'country',
            answer: 'CONSENT_OPTIONAL'
          })
        })
      );
    });
  });

  describe('snapshot', () => {
    it('should match snapshot', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/country'
      });
      expect(response.payload).toMatchSnapshot();
    });
  });
});
