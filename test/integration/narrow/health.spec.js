import { describe, it, expect } from '@jest/globals';
import { configureServer } from '../../../src/server.js';

describe('Service Health', () => {
  let server;

  beforeEach(async () => {
    server = await configureServer();
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
