import Hapi from '@hapi/hapi';
import { describe, it, expect } from '@jest/globals';
import { routes } from '../../src/http/routes/grant-type/grant-type.js';

describe('Invalid Grant and Page', () => {
  let server;

  beforeAll(async () => {
    server = Hapi.server();
    server.route(routes); // Register routes for testing
  });

  it('should return 404 for invalid grant type', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/invalid-grant'
    });

    expect(response.statusCode).toBe(404);
    expect(response.payload).toBe('Grant type not found');
  });

  it('should return 404 for invalid page', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant/invalid-page'
    });

    expect(response.statusCode).toBe(404);
    expect(response.payload).toBe('Page not found');
  });
});
