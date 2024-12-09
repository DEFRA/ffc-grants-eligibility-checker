import { describe, expect, beforeEach, jest } from '@jest/globals';
import statusCodes, {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from '../../../src/constants/status-codes.js';
import { configureServer } from '../../../src/server.js';

jest.setTimeout(10000);

describe('error-pages plugin', () => {
  let server;

  beforeEach(async () => {
    server = await configureServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe('response', () => {
    it('returns 404 for a NOT_FOUND error', async () => {
      server.route({
        method: 'GET',
        path: '/not-found',
        handler: () => {
          const error = new Error('Not Found');
          error.output = { statusCode: statusCodes(NOT_FOUND) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/not-found'
      });

      expect(response.statusCode).toBe(statusCodes(NOT_FOUND));
    });

    it('returns 400 for a BAD_REQUEST error', async () => {
      server.route({
        method: 'GET',
        path: '/bad-request',

        handler: () => {
          const error = new Error('Bad Request');
          error.output = { statusCode: statusCodes(BAD_REQUEST) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/bad-request'
      });

      expect(response.statusCode).toBe(statusCodes(BAD_REQUEST));
    });

    it('returns 403 for a FORBIDDEN error', async () => {
      server.route({
        method: 'GET',
        path: '/forbidden',
        handler: () => {
          const error = new Error('Forbidden');
          error.output = { statusCode: statusCodes(FORBIDDEN) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/forbidden'
      });

      expect(response.statusCode).toBe(statusCodes(FORBIDDEN));
    });

    it('returns 500 for INTERNAL_SERVER_ERROR', async () => {
      server.route({
        method: 'GET',
        path: '/internal-error',
        handler: () => {
          const error = new Error('Internal Server Error');
          error.output = { statusCode: statusCodes(INTERNAL_SERVER_ERROR) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/internal-error'
      });

      expect(response.statusCode).toBe(statusCodes(INTERNAL_SERVER_ERROR));
    });
  });

  describe('snapshot', () => {
    const testSnapshot = async (path, statusCode) => {
      server.route({
        method: 'GET',
        path,
        handler: () => {
          const error = new Error();
          error.output = { statusCode: statusCodes(statusCode), payload: { message: 'supportId' } };
          error.isBoom = true;
          throw error;
        }
      });

      return server.inject({ method: 'GET', url: path });
    };

    it('should match NOT_FOUND snapshot', async () => {
      const response = await testSnapshot('/not-found', NOT_FOUND);
      expect(response.payload).toMatchSnapshot();
    });

    it('should match BAD_REQUEST snapshot', async () => {
      const response = await testSnapshot('/bad-request', BAD_REQUEST);
      expect(response.payload).toMatchSnapshot();
    });

    it('should match FORBIDDEN snapshot', async () => {
      const response = await testSnapshot('/forbidden', FORBIDDEN);
      expect(response.payload).toMatchSnapshot();
    });

    it('should match INTERNAL_SERVER_ERROR snapshot', async () => {
      const response = await testSnapshot('/internal-error', INTERNAL_SERVER_ERROR);
      expect(response.payload).toMatchSnapshot();
    });
  });
});
