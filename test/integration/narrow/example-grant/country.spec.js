import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { configureServer } from '../../../../src/server';
import { JSDOM } from 'jsdom';

describe('Country Page', () => {
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
    const countryPageResponse = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/country'
    });

    dom = new JSDOM(countryPageResponse.payload, {
      runScripts: 'dangerously',
      url: 'https://checker-domain/eligibility-checker/example-grant'
    });

    // Mock `fetch` in the JSDOM window
    dom.window.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ previousPageId: 'start', nextPageId: 'second-question' })
    });
  });

  afterEach(() => {
    server.stop();
  });

  describe('response', () => {
    it('should return 200 on successfull page load', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/country'
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
            currentPageId: 'country',
            nextPageId: 'consent',
            previousPageId: 'start'
          })
        })
      );
    });

    it.each([
      ['Yes', '#country'],
      ['No', '#country-2']
    ])(
      'makes a NEXT transition call when selected %s and the continue button is clicked',
      async (answer, radioSelector) => {
        // Select the radio button based on the provided selector
        const radioOption = dom.window.document.querySelector(radioSelector);
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
              currentPageId: 'country',
              nextPageId: 'consent',
              previousPageId: 'start',
              questionType: 'radio',
              answer
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );
      }
    );
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
