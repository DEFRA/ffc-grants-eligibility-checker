import Hapi from '@hapi/hapi';
import { describe, it, expect } from '@jest/globals';
import { routes } from '../../src/http/routes/grant-type/grant-type.js';

describe('Start Page', () => {
  let server;

  beforeAll(async () => {
    server = Hapi.server();
    server.route(routes); // Register routes for testing
  });

  it('should redirect to start page', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/eligibility-checker/example-grant'
    });

    expect(response.statusCode).toBe(302);
    expect(response.statusMessage).toBe('Found');
    expect(response.headers.location).toBe('/eligibility-checker/example-grant/start');
  });
});
