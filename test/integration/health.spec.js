import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';

const BASE_URL = 'http://localhost';

describe('Service Health', () => {
  jest.setTimeout(30000);

  it('should return 200 OK from /healthy endpoint', async () => {
    const response = await request(BASE_URL).get('/eligibility-checker/healthy').expect(200);

    expect(response.text).toBe('ok');
  });

  it('should return 200 OK from /healthz endpoint', async () => {
    const response = await request(BASE_URL).get('/eligibility-checker/healthz').expect(200);

    expect(response.text).toBe('ok');
  });
});
