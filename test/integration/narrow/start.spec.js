import { describe, it, expect } from '@jest/globals';
import { configureServer } from '../../../src/server';
import { JSDOM } from 'jsdom';

describe('Start Page', () => {
  let server;

  beforeEach(async () => {
    server = await configureServer();
  });

  describe('response', () => {
    it('should redirect to start page successfully', async () => {
      const redirectResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant'
      });

      expect(redirectResponse.statusCode).toBe(302);
      expect(redirectResponse.statusMessage).toBe('Found');
      expect(redirectResponse.headers.location).toBe('/eligibility-checker/example-grant/start');

      const startPageResponse = await server.inject({
        method: 'GET',
        url: redirectResponse.headers.location
      });

      expect(startPageResponse.statusCode).toBe(200);
    });
  });

  describe('view', () => {
    let document;

    beforeEach(async () => {
      const redirectedResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant'
      });

      const startPageResponse = await server.inject({
        method: 'GET',
        url: redirectedResponse.headers.location
      });

      const dom = new JSDOM(startPageResponse.payload);
      document = dom.window.document;
    });

    it('should have correct service name in header', () => {
      const serviceName = document.querySelector('.govuk-header__service-name');
      expect(serviceName).not.toBeNull();
      expect(serviceName.textContent.trim()).toBe('Check if you can apply');
    });

    it('should have correct page title', () => {
      const title = document.querySelector('h1');
      expect(title).not.toBeNull();
      expect(title.textContent.trim()).toBe('Generic checker screens');
    });

    it('should have start button with correct link', () => {
      const startButton = document.querySelector('.govuk-button--start');
      expect(startButton).not.toBeNull();
      expect(startButton.textContent.trim()).toBe('Start now');
      expect(startButton.getAttribute('href')).toBe('country');
    });
  });

  describe('snapshot', () => {
    it('should match snapshot', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant/start'
      });
      expect(response.payload).toMatchSnapshot();
    });
  });
});
