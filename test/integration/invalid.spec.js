import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';

const BASE_URL = 'http://localhost';

describe('Invalid Grant and Page', () => {
  jest.setTimeout(30000);

  it('should return 404 for invalid grant type', async () => {
    const response = await request(BASE_URL).get('/eligibility-checker/invalid-grant').expect(404);

    expect(response.text).toBe('Grant type not found');
  });

  it('should return 404 for invalid page', async () => {
    const response = await request(BASE_URL)
      .get('/eligibility-checker/example-grant/invalid-page')
      .expect(404);

    expect(response.text).toBe('Page not found');
  });
});
