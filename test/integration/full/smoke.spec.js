import { describe, it, expect } from '@jest/globals';
import { configureServer } from '../../../src/server';
import supertest from 'supertest';
import * as cheerio from 'cheerio';

describe('Smoke test', () => {
  let server;
  let request;

  beforeEach(async () => {
    server = await configureServer();
    await server.start();
    request = supertest(`http://localhost:${server.info.port}`);
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should return the correct content on the start page', async () => {
    const response = await request.get('/eligibility-checker/example-grant/start');
    expect(response.statusCode).toBe(200);

    const $ = cheerio.load(response.text);
    expect($('h1').text()).toBe('Generic checker screens');
    expect($('#continueBtn').text()).toContain('Start now');
  });
});
