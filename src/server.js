// istanbul ignore file
import Hapi from '@hapi/hapi';
import { app as appConfig, views as viewConfig } from './config/index.js';
import path from 'path';
import njk from 'nunjucks';
import vision from '@hapi/vision';
import inert from '@hapi/inert';
import { getRouteDefinitions } from './http/routes/routes.js';
import errorPages from './config/plugins/error-pages.js';
import { exampleGrantMachineService } from './config/machines/example-grant-machine.js';
import statusCodes, { OK } from './constants/status-codes.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Retrieves the application's configuration settings.
 * @returns {object} An object containing:
 * - port: The application's port number.
 * - host: The application's host name.
 * - stripTrailingSlash: A boolean indicating whether to strip trailing slashes from URLs.
 * - stylesheetsPath: The absolute path to the stylesheets' directory.
 * - viewsPath: The absolute path to the views directory.
 * - njkEnv: The Nunjucks environment configuration.
 * - context: An object containing additional application context information including:
 *    - version: The version of the application.
 *    - assets: The application's assets.
 *    - govAssets: Government-related assets.
 *    - serviceName: The name of the service.
 *    - pageTitle: The title of the page.
 */
export const getConfig = () => ({
  port: appConfig.port,
  host: appConfig.host,
  stripTrailingSlash: true,
  stylesheetsPath: path.resolve(__dirname, '..', 'public', 'stylesheets'),
  viewsPath: path.resolve(__dirname, '..'),
  njkEnv: njk.configure(viewConfig.paths),
  context: {
    version: appConfig.version,
    assets: viewConfig.assets.app,
    govAssets: viewConfig.assets.gov,
    serviceName: appConfig.name,
    pageTitle: appConfig.name
  }
});

/**
 * Creates and configures an instance of a Hapi server.
 * @param {object} options - The configuration options for the server.
 * @param {number} options.port - The port number on which the server will listen.
 * @param {string} options.host - The host name or IP address the server will bind to.
 * @param {boolean} options.stripTrailingSlash - Whether to remove trailing slashes from incoming requests.
 * @returns {object} The configured Hapi server instance.
 */
const createServer = ({ port, host, stripTrailingSlash }) =>
  Hapi.server({ port, host, router: { stripTrailingSlash } });

/**
 * Asynchronously registers plugins for a given server.
 * @param {object} server - The server instance that plugins will be registered to.
 * @returns {Function} A function that, when called, registers the inert and vision plugins asynchronously.
 */
const registerPlugins = (server) => async () => {
  await server.register(inert);
  await server.register(vision);
  await server.register(errorPages);
};

/**
 * Configures the server with predefined routes and a specific route
 * for serving stylesheets from a given directory.
 * @param {object} server - The server instance to configure routes on.
 * @param {string} stylesheetsPath - The directory path for serving stylesheets.
 */
export const addRoutes = (server, stylesheetsPath) => {
  server.route([
    {
      method: 'GET',
      path: '/eligibility-checker/stylesheets/{file*}',
      handler: {
        directory: {
          path: stylesheetsPath
        }
      }
    },
    {
      method: 'GET',
      path: '/eligibility-checker/assets/{file*}',
      handler: {
        directory: {
          path: path.resolve(
            __dirname,
            '..',
            'node_modules',
            'govuk-frontend',
            'dist',
            'govuk',
            'assets'
          )
        }
      }
    },
    {
      method: 'POST',
      path: `/eligibility-checker/{grantTypeId}/transition`,
      /**
       * Handles state machine transitions
       * @param {object} request - The request object
       * @param {object} h - The response toolkit
       * @returns {object} The response object
       */
      handler: (request, h) => {
        const { event, nextPageId, previousPageId } = request.payload;

        exampleGrantMachineService.send({
          type: event,
          nextPageId,
          previousPageId
        });

        return h.response({ status: 'success' }).code(statusCodes(OK));
      }
    }
  ]);

  const routes = getRouteDefinitions();
  routes.forEach((route) => server.route(route));
};
/**
 * Configures the view rendering engine for a given server.
 * @param {object} server - The server instance to configure views for.
 * @param {string} viewsPath - The path to the views directory.
 * @param {object} njkEnv - The Nunjucks environment object.
 * @param {object} context - The context to be applied to views.
 */
export const configureViews = (server, viewsPath, njkEnv, context) => {
  server.views({
    engines: {
      njk: {
        /**
         * Compiles a given Nunjucks template source string using the specified environment options
         * and returns a rendering function to generate the template output.
         * @param {string} src - The source string of the Nunjucks template to compile.
         * @param {object} options - Compilation options.
         * @param {object} options.environment - The Nunjucks environment within which the template will be compiled.
         * @returns {Function} A function that takes a context object and returns the rendered template output as a string.
         */
        compile: (src, options) => {
          const template = njk.compile(src, options.environment);
          return (templateContext) => template.render(templateContext);
        }
      }
    },
    relativeTo: viewsPath,
    compileOptions: {
      environment: njkEnv
    },
    path: viewConfig.paths[0],
    context
  });
};

/**
 * Creates and configures an instance of a Hapi server.
 *
 * This asynchronous function carries out the following actions:
 * 1. Retrieves the server configuration.
 * 2. Creates the server instance with the retrieved configuration.
 * 3. Registers necessary plugins on the server.
 * 4. Adds the defined routes to the server using the configuration's stylesheet path.
 * 5. Configures the view settings for the server using the specified parameters.
 * @returns {object} The configured Hapi server instance.
 */
export const configureServer = async () => {
  const config = getConfig();
  const server = createServer(config);

  await registerPlugins(server)();

  server.ext('onRequest', (request, h) => {
    console.log(`Request URL: ${request.url}`);
    return h.continue;
  });

  addRoutes(server, config.stylesheetsPath);
  configureViews(server, config.viewsPath, config.njkEnv, config.context);

  return server;
};

/**
 * Initializes the server by performing several setup tasks.
 *
 * This asynchronous function carries out the following actions:
 * 1. Creates and configures the Hapi server
 * 2. Starts the server asynchronously.
 *
 * Upon successful start, logs the server's base URL to console.
 * @returns {Promise<void>} A promise that resolves when the server has started.
 */
export const init = async () => {
  const server = await configureServer();

  await server.start();

  console.log('Server running on http://localhost:3000/eligibility-checker/grant-name/start');
};
