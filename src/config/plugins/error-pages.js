/*
 * Add an `onPreResponse` listener to return error pages
 */
export default {
  plugin: {
    name: "error-pages",
    /**
     * Register the `onPreResponse` listener
     * @param {object} server - The server object
     * @param {object} _options - The options
     */
    register: (server, _options) => {
      server.ext("onPreResponse", (request, h) => {
        const response = request.response;

        if (response.isBoom) {
          // console.warn(`response.message=${response.message}`);
          // console.warn(`response=${JSON.stringify(response, null, 2)}`);
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode;
          if (statusCode === 404) {
            return h.view("404", response).code(statusCode).takeover();
          }
          const err = {
            statusCode,
            data: response.data,
            message: response.message,
          };
          console.error("error", err);

          if (statusCode === 400) {
            return h.view("400", response).code(statusCode).takeover();
          }

          if (statusCode === 403 || response.message.includes("support ID")) {
            return h.view("403", response).code(statusCode).takeover();
          }
          // The return the `500` view
          return h.view("500", response).code(statusCode).takeover();
        }
        return h.continue;
      });
    },
  },
};
