import { describe, it, expect } from '@jest/globals';
import { configureServer } from '../../../src/server';
import * as cheerio from 'cheerio';

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
    let $;
    beforeEach(async () => {
      const redirectedResponse = await server.inject({
        method: 'GET',
        url: '/eligibility-checker/example-grant'
      });

      const startPageResponse = await server.inject({
        method: 'GET',
        url: redirectedResponse.headers.location
      });

      // Load the HTML response into Cheerio
      $ = cheerio.load(startPageResponse.payload);
    });

    it('should have correct service name in header', () => {
      const serviceName = $('.govuk-header__service-name');
      expect(serviceName.length).toBe(1);
      expect(serviceName.text().trim()).toBe('Check if you can apply');
    });

    it('should have correct page title', () => {
      const title = $('h1');
      expect(title.length).toBe(1);
      expect(title.text().trim()).toBe('Generic checker screens');
    });

    it('should have start button with correct link', () => {
      const startButton = $('.govuk-button--start');
      expect(startButton.length).toBe(1);
      expect(startButton.text().trim()).toBe('Start now');
      expect(startButton.attr('href')).toBe('country');
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
