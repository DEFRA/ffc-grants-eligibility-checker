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
import { createRequire } from 'module';
import { grantIdToMachineServiceMap } from './config/machines/index.js';
import { Boom } from '@hapi/boom';
import { checkPageForError } from './validation/check-page-for-error.js';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

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
export const getConfig = () => {
  const njkEnv = njk.configure(viewConfig.paths);

  return {
    port: appConfig.port,
    host: appConfig.host,
    stripTrailingSlash: true,
    stylesheetsPath: path.resolve(__dirname, '..', 'public', 'stylesheets'),
    viewsPath: path.resolve(__dirname, '..'),
    njkEnv,
    context: {
      version: appConfig.version,
      assets: viewConfig.assets.app,
      govAssets: viewConfig.assets.gov,
      serviceName: appConfig.name,
      pageTitle: appConfig.name
    }
  };
};

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
      path: `/eligibility-checker/{grantType}/transition`,
      /**
       * Handles state machine transitions
       * @param {object} request - The request object
       * @param {object} h - The response toolkit
       * @returns {object} The response object
       */
      handler: (request, h) => {
        const { grantType } = request.params;
        const { event, currentPageId, nextPageId, previousPageId, answer } = request.payload;
        const grantTypeMachineService = grantIdToMachineServiceMap[grantType];

        if (grantTypeMachineService) {
          const pageError = checkPageForError(grantTypeMachineService, request, h);
          if (pageError) return pageError;

          exampleGrantMachineService.send({
            type: event,
            currentPageId,
            nextPageId,
            previousPageId,
            answer
          });

          return h
            .response({ status: 'success', nextPageId, previousPageId })
            .code(statusCodes(OK));
        }

        console.warn('viewGrantType: Grant type is invalid');
        throw Boom.notFound('Grant type not found');
      }
    }
  ]);

  const routes = getRouteDefinitions();
  routes.forEach((route) => server.route(route));
};

/**
 * Adds a middleware function to the server that adds a custom HTTP response header, `X-App-Version`, to all
 * responses with the value of the `APP_VERSION` environment variable or a default value of `1.0.0` if the variable
 * is not set.
 * @param {object} server - The server instance on which to add the middleware.
 */
export const addMiddleware = (server) => {
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      response.output.headers['X-App-Version'] = pkg.version || 'unset';
    } else {
      response.header('X-App-Version', pkg.version || 'unset');
    }
    return h.continue;
  });
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
 * 6. Starts all grant state machines to ensure that their services are running.
 * 7. Adds an onPreStop event handler to stop all grant state machines before the server is stopped.
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
  addMiddleware(server);
  configureViews(server, config.viewsPath, config.njkEnv, config.context);

  startGrantStateMachines();

  server.ext({
    type: 'onPreStop',
    /**
     * Stops all grant state machines before the server is stopped.
     *
     * This allows the XState service to be stopped properly and avoid any potential
     * memory leaks.
     * @param {object} _server - The server instance
     */
    method: async (_server) => {
      stopGrantStateMachines();
    }
  });

  return server;
};

/**
 * Starts all grant state machines to ensure that their services are running.
 *
 * This function is used to initialize the grant state machines when the server starts.
 */
export const startGrantStateMachines = () => {
  Object.values(grantIdToMachineServiceMap).forEach((machineService) => {
    machineService.start();
  });
};

/**
 * Stops all grant state machines to ensure that their services are terminated.
 *
 * This function is used to shutdown the grant state machines when the server stops.
 */
const stopGrantStateMachines = () => {
  Object.values(grantIdToMachineServiceMap).forEach((machineService) => {
    machineService.stop();
  });
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
  const server = await configureServer(); // NOSONAR:S4123 - Allow await as even though server is not a promise configureServer is async

  await server.start();

  console.log('Server running on http://localhost:3000/eligibility-checker/grant-name/start');
};
