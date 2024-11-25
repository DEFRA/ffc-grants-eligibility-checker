import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { configureServer } from '../../../../src/server';

describe('Country Validation Page', () => {
  let server;

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

    // Transition with no answers causing validation error
    await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'country',
        nextPageId: 'consent',
        previousPageId: 'start',
        questionType: 'radio',
        answer: null
      }
    });
  });

  afterEach(() => {
    server.stop();
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
