import { describe, expect, beforeEach } from '@jest/globals';
import statusCodes, {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from '../../../src/constants/status-codes.js';
import { configureServer } from '../../../src/server.js';
import * as cheerio from 'cheerio';

describe('error-pages plugin', () => {
  let server;

  beforeEach(async () => {
    server = await configureServer();
  });

  describe('response', () => {
    it('returns 404 for a NOT_FOUND error', async () => {
      server.route({
        method: 'GET',
        path: '/not-found',
        handler: () => {
          const error = new Error('Not Found');
          error.output = { statusCode: statusCodes(NOT_FOUND) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/not-found'
      });

      expect(response.statusCode).toBe(statusCodes(NOT_FOUND));
    });

    it('returns 400 for a BAD_REQUEST error', async () => {
      server.route({
        method: 'GET',
        path: '/bad-request',

        handler: () => {
          const error = new Error('Bad Request');
          error.output = { statusCode: statusCodes(BAD_REQUEST) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/bad-request'
      });

      expect(response.statusCode).toBe(statusCodes(BAD_REQUEST));
    });

    it('returns 403 for a FORBIDDEN error', async () => {
      server.route({
        method: 'GET',
        path: '/forbidden',
        handler: () => {
          const error = new Error('Forbidden');
          error.output = { statusCode: statusCodes(FORBIDDEN) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/forbidden'
      });

      expect(response.statusCode).toBe(statusCodes(FORBIDDEN));
    });

    it('returns 500 for INTERNAL_SERVER_ERROR', async () => {
      server.route({
        method: 'GET',
        path: '/internal-error',
        handler: () => {
          const error = new Error('Internal Server Error');
          error.output = { statusCode: statusCodes(INTERNAL_SERVER_ERROR) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({
        method: 'GET',
        url: '/internal-error'
      });

      expect(response.statusCode).toBe(statusCodes(INTERNAL_SERVER_ERROR));
    });
  });

  describe('view', () => {
    describe('NOT_FOUND', () => {
      let $;
      beforeEach(async () => {
        server.route({
          method: 'GET',
          path: '/not-found',
          handler: () => {
            const error = new Error('Not Found');
            error.output = { statusCode: statusCodes(NOT_FOUND) };
            error.isBoom = true;
            throw error;
          }
        });

        const response = await server.inject({
          method: 'GET',
          url: '/not-found'
        });

        $ = cheerio.load(response.payload);
      });
      it('should show correct message in title', () => {
        expect($('title').text().trim()).toContain('Page not found');
      });

      it('should show correct message in header', () => {
        expect($('h1').text().trim()).toContain('Page not found');
      });
    });

    describe('BAD_REQUEST', () => {
      let $;
      beforeEach(async () => {
        server.route({
          method: 'GET',
          path: '/bad-request',

          handler: () => {
            const error = new Error('Bad Request');
            error.output = { statusCode: statusCodes(BAD_REQUEST) };
            error.isBoom = true;
            throw error;
          }
        });

        const response = await server.inject({
          method: 'GET',
          url: '/bad-request'
        });

        $ = cheerio.load(response.payload);
      });

      it('should show correct message in title', () => {
        expect($('title').text().trim()).toContain('Bad request');
      });

      it('should show correct message in header', () => {
        expect($('h1').text().trim()).toContain('Bad request');
      });
    });

    describe('FORBIDDEN', () => {
      let $;
      const supportId = '12321432432';
      beforeEach(async () => {
        server.route({
          method: 'GET',
          path: '/forbidden',
          handler: () => {
            const error = new Error('Forbidden');
            error.output = {
              statusCode: statusCodes(FORBIDDEN),
              payload: { message: supportId }
            };
            error.isBoom = true;
            throw error;
          }
        });

        const response = await server.inject({
          method: 'GET',
          url: '/forbidden'
        });

        $ = cheerio.load(response.payload);
      });

      it('should show correct message in title', () => {
        expect($('title').text().trim()).toContain('The requested URL was rejected');
      });

      it('should show correct message in header', () => {
        expect($('h1').text().trim()).toContain('Sorry, the requested URL was rejected');
      });

      it('should show correct message in paragraph', () => {
        expect($('p.govuk-body').eq(0).text().trim()).toContain('Please try again later.');
        expect($('p.govuk-body').eq(1).text().trim()).toContain(
          'We have not saved your answers. When the service is available, you will have to start again.'
        );
        expect($('p.govuk-body').eq(2).text().trim()).toContain(`Your support ID is: ${supportId}`);
        expect($('p.govuk-body').eq(3).text().trim()).toContain(
          'Contact the RPA Helpline and follow the options for the Farming Investment Fund scheme if you have any questions.'
        );
        expect($('p.govuk-body').eq(4).text().trim()).toContain('Telephone: 0300 0200 301');
      });
    });

    describe('INTERNAL_SERVER_ERROR', () => {
      let $;
      beforeEach(async () => {
        server.route({
          method: 'GET',
          path: '/internal-error',
          handler: () => {
            const error = new Error('Internal Server Error');
            error.output = { statusCode: statusCodes(INTERNAL_SERVER_ERROR) };
            error.isBoom = true;
            throw error;
          }
        });

        const response = await server.inject({
          method: 'GET',
          url: '/internal-error'
        });

        $ = cheerio.load(response.payload);
      });

      it('should show correct message in title', () => {
        expect($('title').text().trim()).toContain('Problem with service');
      });

      it('should show correct message in header', () => {
        expect($('h1').text().trim()).toContain('Sorry, there is a problem with the service');
      });

      it('should show correct message in paragraph', () => {
        expect($('title').text().trim()).toContain('Problem with service');
        expect($('h1').text().trim()).toContain('Sorry, there is a problem with the service');
        expect($('p.govuk-body').eq(0).text().trim()).toContain('Try again later.');
        expect($('p.govuk-body').eq(1).text().trim()).toContain(
          'We have not saved your answers. When the service is available, you will have to start again.'
        );
        expect($('p.govuk-body').eq(2).text().trim()).toContain(
          'Contact the RPA Helpline and follow the options for the Farming Investment Fund scheme if you have any questions.'
        );
        expect($('p.govuk-body').eq(3).text().trim()).toContain('Telephone: 0300 0200 301');
      });
    });
  });
});
