import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { configureServer } from '../../../../src/server';
import crypto from 'crypto';

jest.setTimeout(10000);

describe('Confirmation Page', () => {
  let server;
  let cookie;

  beforeEach(async () => {
    server = await configureServer();
    await server.start();

    // Initial transition to "country" state
    const transitionResponse = await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'start',
        nextPageId: 'country'
      }
    });

    cookie = transitionResponse.headers['set-cookie'][0].split(';')[0];

    // Transition to the "consent" state
    await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'country',
        nextPageId: 'consent'
      },
      headers: {
        cookie
      }
    });
    // Transition to the "confirmation" state
    await server.inject({
      method: 'POST',
      url: '/eligibility-checker/example-grant/transition',
      payload: {
        event: 'NEXT',
        currentPageId: 'consent',
        nextPageId: 'confirmation'
      },
      headers: {
        cookie
      }
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  describe('response', () => {
    it('should return 200 on successfull page load', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/confirmation',
        headers: {
          cookie
        }
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('snapshot', () => {
    beforeEach(() => {
      const realRandomBytes = crypto.randomBytes; // Store the original function
      // Mock crypto.randomBytes to return predictable values
      jest.spyOn(crypto, 'randomBytes').mockImplementation((size) => {
        // Return a fixed sequence of random bytes for the given size
        if (size === 1) {
          // Return specific bytes to generate a predictable confirmation ID
          return Buffer.from([10]); // 'A' for the first randomChar()
        }
        // Default return value for larger sizes if necessary
        return realRandomBytes(size);
      });
    });

    it('should match snapshot', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/confirmation',
        headers: {
          cookie
        }
      });
      expect(response.payload).toMatchSnapshot();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
