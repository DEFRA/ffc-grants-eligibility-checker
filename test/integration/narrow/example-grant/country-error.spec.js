import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { configureServer } from '../../../../src/server';
import { JSDOM } from 'jsdom';

describe('Country Page Error Handling', () => {
  let server;
  let dom;
  const mockErrorContent = {
    key: 'countryRequired',
    message: 'Select an option'
  };

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
      json: async () => ({ status: 'error', currentPageId: 'country' })
    });
  });

  afterEach(() => {
    server.stop();
  });

  describe('Validation Error', () => {
    it('should show error summary when no radio option is selected', async () => {
      // Get the continue button
      const continueButton = dom.window.document.querySelector('#Continue');
      expect(continueButton).not.toBeNull();

      // Simulate form submission without selecting a radio button
      continueButton.click();

      // Verify fetch was called with correct parameters for "NEXT" event with null answer
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
            answer: null
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      // Simulate server response with error
      await server.inject({
        method: 'POST',
        url: '/eligibility-checker/example-grant/transition',
        payload: {
          event: 'NEXT',
          currentPageId: 'country',
          answer: null
        }
      });

      // Get the updated page with error
      const updatedPageResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/country'
      });

      const updatedDom = new JSDOM(updatedPageResponse.payload);

      // Check error summary exists
      const errorSummary = updatedDom.window.document.querySelector('.govuk-error-summary');
      expect(errorSummary).not.toBeNull();

      // Verify error message content
      const errorMessage = updatedDom.window.document.querySelector('.govuk-error-summary__body');
      expect(errorMessage.textContent).toContain(mockErrorContent.message);
    });

    it('should clear validation error when radio option is selected', async () => {
      // First trigger the error
      await server.inject({
        method: 'POST',
        url: '/eligibility-checker/example-grant/transition',
        payload: {
          event: 'NEXT',
          currentPageId: 'country',
          answer: null
        }
      });

      // Then simulate selecting an option and submitting
      await server.inject({
        method: 'POST',
        url: '/eligibility-checker/example-grant/transition',
        payload: {
          event: 'NEXT',
          currentPageId: 'country',
          answer: 'Yes'
        }
      });

      // Get the updated page
      const updatedPageResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/country'
      });

      const updatedDom = new JSDOM(updatedPageResponse.payload);

      // Check error summary no longer exists
      const errorSummary = updatedDom.window.document.querySelector('.govuk-error-summary');
      expect(errorSummary).toBeNull();
    });
  });

  describe('snapshot', () => {
    it('should match error state snapshot', async () => {
      // Trigger the error state
      await server.inject({
        method: 'POST',
        url: '/eligibility-checker/example-grant/transition',
        payload: {
          event: 'NEXT',
          currentPageId: 'country',
          answer: null
        }
      });

      // Get the page in error state
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/country'
      });

      expect(response.payload).toMatchSnapshot();
    });
  });
});