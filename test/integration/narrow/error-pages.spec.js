import { jest, describe, expect, beforeEach } from '@jest/globals';
import Hapi from '@hapi/hapi';
import request from 'supertest';
import { errorHandler } from '../../../src/config/plugins/error-pages.js';
import statusCodes, {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from '../../../src/constants/status-codes.js';

jest.setTimeout(30000); // Set timeout to 30 seconds for this test

describe('error-pages plugin', () => {
  let server;
  const mockCode = jest.fn().mockImplementation(() => ({
    takeover: jest.fn().mockReturnThis()
  }));
  const mockView = jest.fn().mockImplementation(() => ({
    code: mockCode // chainable response method
  }));

  // Initialize a Hapi server before each test
  beforeEach(async () => {
    jest.clearAllMocks();
    server = Hapi.server();

    // Mock the onPreResponse extension to use the custom h
    server.ext('onPreResponse', (request, _h) => {
      return errorHandler(request, {
        view: mockView,
        continue: jest.fn() // Mock the continue method
      });
    });
  });

  // Close the server after each test
  afterEach(async () => {
    await server.stop();
  });

  test('returns 404 view for a NOT_FOUND error', async () => {
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

    await request(server.listener).get('/not-found');

    expect(mockView).toHaveBeenCalledWith(statusCodes(NOT_FOUND).toString(), expect.anything());
    expect(mockCode).toHaveBeenCalledWith(statusCodes(NOT_FOUND));
  });

  test('returns 400 view for a BAD_REQUEST error', async () => {
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

    await request(server.listener).get('/bad-request');

    expect(mockView).toHaveBeenCalledWith(statusCodes(BAD_REQUEST).toString(), expect.anything());
    expect(mockCode).toHaveBeenCalledWith(statusCodes(BAD_REQUEST));
  });

  test('returns 403 view for a FORBIDDEN error', async () => {
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

    await request(server.listener).get('/forbidden');

    expect(mockView).toHaveBeenCalledWith(statusCodes(FORBIDDEN).toString(), expect.anything());
    expect(mockCode).toHaveBeenCalledWith(statusCodes(FORBIDDEN));
  });

  test('returns 500 view for INTERNAL_SERVER_ERROR', async () => {
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

    await request(server.listener).get('/internal-error');

    expect(mockView).toHaveBeenCalledWith(
      statusCodes(INTERNAL_SERVER_ERROR).toString(),
      expect.anything()
    );
    expect(mockCode).toHaveBeenCalledWith(statusCodes(INTERNAL_SERVER_ERROR));
  });
});
