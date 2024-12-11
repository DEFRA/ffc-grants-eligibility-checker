import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { configureServer } from '../../../src/server.js';

jest.setTimeout(10000);

describe('Service Health', () => {
  let server;

  beforeEach(async () => {
    server = await configureServer();
    await server.start();
  });

  afterEach(async () => {
    await server.stop();
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
