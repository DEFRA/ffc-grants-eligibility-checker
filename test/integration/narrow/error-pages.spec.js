import { describe, expect, beforeEach } from '@jest/globals';
import statusCodes, {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from '../../../src/constants/status-codes.js';
import { configureServer } from '../../../src/server.js';
import { JSDOM } from 'jsdom';

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
    const setupErrorRoute = async (path, statusCode, headerText) => {
      server.route({
        method: 'GET',
        path,
        handler: () => {
          const error = new Error(headerText);
          error.output = { statusCode: statusCodes(statusCode) };
          error.isBoom = true;
          throw error;
        }
      });

      const response = await server.inject({ method: 'GET', url: path });
      const dom = new JSDOM(response.payload);
      const document = dom.window.document;
      return { document, response };
    };
    describe('NOT_FOUND', () => {
      let document;
      beforeEach(async () => {
        ({ document } = await setupErrorRoute('/not-found', NOT_FOUND, 'Page not found'));
      });
      it('should show correct message in title', () => {
        expect(document.querySelector('title').textContent.trim()).toContain('Page not found');
      });

      it('should show correct message in header', () => {
        expect(document.querySelector('h1').textContent.trim()).toContain('Page not found');
      });
    });

    describe('BAD_REQUEST', () => {
      let document;
      beforeEach(async () => {
        ({ document } = await setupErrorRoute('/bad-request', BAD_REQUEST, 'Bad request'));
      });

      it('should show correct message in title', () => {
        expect(document.querySelector('title').textContent.trim()).toContain('Bad request');
      });

      it('should show correct message in header', () => {
        expect(document.querySelector('h1').textContent.trim()).toContain('Bad request');
      });
    });

    describe('FORBIDDEN', () => {
      let document;
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

        const response = await server.inject({ method: 'GET', url: '/forbidden' });
        const dom = new JSDOM(response.payload);
        document = dom.window.document;
      });

      it('should show correct message in title', () => {
        expect(document.querySelector('title').textContent.trim()).toContain(
          'The requested URL was rejected'
        );
      });

      it('should show correct message in header', () => {
        expect(document.querySelector('h1').textContent.trim()).toContain(
          'Sorry, the requested URL was rejected'
        );
      });

      it('should show correct message in paragraph', () => {
        const paragraphs = document.querySelectorAll('p.govuk-body');
        expect(paragraphs[0].textContent.trim()).toContain('Please try again later.');
        expect(paragraphs[1].textContent.trim()).toContain(
          'We have not saved your answers. When the service is available, you will have to start again.'
        );
        expect(paragraphs[2].textContent.trim()).toContain(`Your support ID is: ${supportId}`);
        expect(paragraphs[3].textContent.trim()).toContain(
          'Contact the RPA Helpline and follow the options for the Farming Investment Fund scheme if you have any questions.'
        );
        expect(paragraphs[4].textContent.trim()).toContain('Telephone: 0300 0200 301');
      });
    });

    describe('INTERNAL_SERVER_ERROR', () => {
      let document;
      beforeEach(async () => {
        ({ document } = await setupErrorRoute(
          '/internal-error',
          INTERNAL_SERVER_ERROR,
          'Sorry, there is a problem with the service'
        ));
      });

      it('should show correct message in title', () => {
        expect(document.querySelector('title').textContent.trim()).toContain(
          'Problem with service'
        );
      });

      it('should show correct message in header', () => {
        expect(document.querySelector('h1').textContent.trim()).toContain(
          'Sorry, there is a problem with the service'
        );
      });

      it('should show correct message in paragraph', () => {
        const paragraphs = document.querySelectorAll('p.govuk-body');
        expect(paragraphs[0].textContent.trim()).toContain('Try again later.');
        expect(paragraphs[1].textContent.trim()).toContain(
          'We have not saved your answers. When the service is available, you will have to start again.'
        );
        expect(paragraphs[2].textContent.trim()).toContain(
          'Contact the RPA Helpline and follow the options for the Farming Investment Fund scheme if you have any questions.'
        );
        expect(paragraphs[3].textContent.trim()).toContain('Telephone: 0300 0200 301');
      });
    });
  });

  describe('snapshot', () => {
    const testSnapshot = async (path, statusCode) => {
      server.route({
        method: 'GET',
        path,
        handler: () => {
          const error = new Error();
          error.output = { statusCode: statusCodes(statusCode), payload: { message: 'supportId' } };
          error.isBoom = true;
          throw error;
        }
      });

      return server.inject({ method: 'GET', url: path });
    };

    it('should match NOT_FOUND snapshot', async () => {
      const response = await testSnapshot('/not-found', NOT_FOUND);
      expect(response.payload).toMatchSnapshot();
    });

    it('should match BAD_REQUEST snapshot', async () => {
      const response = await testSnapshot('/bad-request', BAD_REQUEST);
      expect(response.payload).toMatchSnapshot();
    });

    it('should match FORBIDDEN snapshot', async () => {
      const response = await testSnapshot('/forbidden', FORBIDDEN);
      expect(response.payload).toMatchSnapshot();
    });

    it('should match INTERNAL_SERVER_ERROR snapshot', async () => {
      const response = await testSnapshot('/internal-error', INTERNAL_SERVER_ERROR);
      expect(response.payload).toMatchSnapshot();
    });
  });
});
