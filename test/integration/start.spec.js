import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { JSDOM } from 'jsdom';

const BASE_URL = 'http://localhost';

describe('Start Page', () => {
  jest.setTimeout(30000);

  let dom;
  let document;

  beforeAll(async () => {
    await request(BASE_URL)
      .get('/eligibility-checker/example-grant')
      .expect(302)
      .expect('Location', 'example-grant/start');

    const startPageResponse = await request(BASE_URL)
      .get('/eligibility-checker/example-grant/start')
      .expect(200);

    dom = new JSDOM(startPageResponse.text);
    document = dom.window.document;
  });

  it('should have correct service name in header', () => {
    const serviceName = document.querySelector('.govuk-header__service-name');
    expect(serviceName.textContent.trim()).toBe('Check if you can apply');
  });

  it('should have correct page title', () => {
    const title = document.querySelector('h1');
    expect(title.textContent.trim()).toBe('Generic checker screens');
  });

  it('should have start button with correct link', () => {
    const startButton = document.querySelector('.govuk-button--start');
    expect(startButton).not.toBeNull();
    expect(startButton.textContent.trim()).toBe('Start now');
    expect(startButton.getAttribute('href')).toBe('eligibility/common/country');
  });
});
