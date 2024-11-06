import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { configureServer } from '../../../src/server';
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
        id: 'start',
        nextPageId: 'country'
      }
    });
    // Load the "country" page with a base URL
    const countryPageResponse = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/country'
    });

    dom = new JSDOM(countryPageResponse.payload, {
      runScripts: 'dangerously'
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

  describe('view', () => {
    it('should have correct service name in header', () => {
      const serviceName = dom.window.document.querySelector('.govuk-header__service-name');
      expect(serviceName).not.toBeNull();
      expect(serviceName.textContent.trim()).toBe('Check if you can apply');
    });

    it('should have correct page title', () => {
      const title = dom.window.document.querySelector('h1');
      expect(title).not.toBeNull();
      expect(title.textContent.trim()).toBe('Is the planned project in England?');
    });

    it('should have back button with correct link', () => {
      const backButton = dom.window.document.querySelector('.govuk-back-link');
      expect(backButton).not.toBeNull();
      expect(backButton.textContent.trim()).toBe('Back');
      expect(backButton.getAttribute('href')).toBe('start');
    });

    it('should have continue button with correct label', () => {
      const continueButton = dom.window.document.querySelector('.govuk-button');
      expect(continueButton).not.toBeNull();
      expect(continueButton.textContent.trim()).toBe('Continue');
    });
  });

  describe('interaction', () => {
    it('navigates to the previous page when the back button is clicked', async () => {
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
            nextPageId: 'second-question',
            previousPageId: 'start'
          })
        })
      );
    });

    it('navigates to the next page when the continue button is clicked', async () => {
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
            id: 'country',
            nextPageId: 'second-question',
            previousPageId: 'start',
            answer: null
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
