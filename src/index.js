import Hapi from '@hapi/hapi'
import { app as appConfig, views as viewConfig } from './config'
import { compile, configure } from 'nunjucks'
import { getRouteDefinitions } from './http/routes/routes.js'

/**
 * An async function that initializes the Hapi server
 * @returns {Promise} A promise that resolves when the server is started
 */
const init = async () => {
  // Create the server
  const server = Hapi.server({
    // Set the server port
    port: appConfig.port,
    // Set the server host
    host: appConfig.host
  })

  // Get the route definitions
  const routes = getRouteDefinitions()

  // Add the routes to the server
  routes.forEach(route => server.route(route))

  // Configure the view engine
  server.views({
    engines: {
      njk: {
        /**
         * Compiles a template and returns a function that renders the template with a given context
         * @param {string} src - The source of the template
         * @param {object} options - The options for the compilation
         * @param {object} options.environment - The environment for the compilation
         * @returns {(context: object) => string} - A function that renders the template with a given context
         */
        compile: (src, options) => {
          // Compile the template
          const template = compile(src, options.environment)

          // Return a function that renders the template
          return context => template.render(context)
        }
      }
    },
    // Set the relative directory
    relativeTo: __dirname,
    // Set the compile options
    compileOptions: {
      // Set the environment
      environment: configure(viewConfig.paths)
    },
    // Set the path
    // @todo need to review this, it will be fine for now but could trip us up later on
    path: viewConfig.paths[0],
    // Set the context
    context: {
      // Set the version
      version: appConfig.version,
      // Set the assets
      assets: viewConfig.assets.app,
      // Set the gov assets
      govAssets: viewConfig.assets.gov,
      // Set the service name
      serviceName: appConfig.name,
      // Set the page title
      // @todo this can no longer come from config. Must come from the grant type data.
      pageTitle: appConfig.name
      // googleTagManagerKey: config.googleTagManagerKey,
      // analyticsTagKey: config.analyticsTagKey
    }
  })

  // Start the server
  await server.start()

  // Log a message to the console
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init().then(r => console.log(r))
