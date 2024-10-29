// istanbul ignore file
// TODO: Add narrow integration tests

import statusCodes, {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from '../../constants/status-codes';

/*
 * Add an `onPreResponse` listener to return error pages
 */
export default {
  plugin: {
    name: 'error-pages',
    /**
     * Register the `onPreResponse` listener
     * @param {object} server - The server object
     * @param {object} _options - The options
     */
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode;
          if (statusCode === NOT_FOUND) {
            return h.view(NOT_FOUND, response).code(statusCodes(NOT_FOUND)).takeover();
          }
          const err = {
            statusCode,
            data: response.data,
            message: response.message
          };
          console.error('error', err);

          if (statusCode === BAD_REQUEST) {
            return h.view(BAD_REQUEST, response).code(statusCodes(BAD_REQUEST)).takeover();
          }

          if (statusCode === FORBIDDEN || response.message.includes('support ID')) {
            return h.view(FORBIDDEN, response).code(statusCodes(FORBIDDEN)).takeover();
          }
          // The return the `500` view
          return h
            .view(INTERNAL_SERVER_ERROR, response)
            .code(statusCodes(INTERNAL_SERVER_ERROR))
            .takeover();
        }
        return h.continue;
      });
    }
  }
};
