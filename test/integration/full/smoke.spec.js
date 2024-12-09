import { describe, it, expect } from '@jest/globals';
import { configureServer } from '../../../src/server';
import supertest from 'supertest';
import { JSDOM } from 'jsdom';

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

    const dom = new JSDOM(response.text);
    const document = dom.window.document;

    const heading = document.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Generic checker screens');

    const continueButton = document.querySelector('.govuk-button');
    expect(continueButton).not.toBeNull();
    expect(continueButton.textContent).toContain('Start now');
  });
});
