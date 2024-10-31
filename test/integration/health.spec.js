import Hapi from '@hapi/hapi';
import { describe, it, expect } from '@jest/globals';
import { routes } from '../../src/http/routes/grant-type/grant-type.js';

describe('Service Health', () => {
  let server;

  beforeAll(async () => {
    server = Hapi.server();
    server.route(routes); // Register routes for testing
  });

  it('should return 200 OK from /healthy endpoint', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/healthy'
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe('ok');
    expect(response.result).toBe('ok');
  });

  it('should return 200 OK from /healthz endpoint', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/healthz'
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe('ok');
    expect(response.result).toBe('ok');
  });
});
