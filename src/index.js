import Hapi from '@hapi/hapi';
import {app as appConfig, views as viewConfig} from "./config/index.js";
import path from "path";
import njk from "nunjucks";
import vision from "vision";
import inert from "@hapi/inert";
import {getRouteDefinitions} from "./http/routes/routes.js";

/**
 * Initialize the server
 * @returns {Promise<void>}
 */
const init = async () => {
    const server = Hapi.server({
        port: appConfig.port,
        host: appConfig.host,
    });

    await server.register(inert);
    await server.register(vision);

    server.route({
        method: 'GET',
        path: '/stylesheets/{file*}',
        handler: {
            directory: {
                path: path.resolve(import.meta.dirname, '..', 'public', 'stylesheets')
            }
        }
    });

    const routes = getRouteDefinitions();
    routes.forEach(route => server.route(route))

    server.views({
        engines: {
            njk: {
                compile: (src, options) => {
                    const template = njk.compile(src, options.environment)
                    return context => template.render(context)
                }
            }
        },
        relativeTo: path.resolve(import.meta.dirname, '..'),
        compileOptions: {
            environment: njk.configure(viewConfig.paths)
        },
        //@todo need to review this, it will be fine for now but could trip us up later on
        path: viewConfig.paths[0],
        context: {
            version: appConfig.version,
            assets: viewConfig.assets.app,
            govAssets: viewConfig.assets.gov,
            serviceName: appConfig.name,
            //@todo this can no longer come from config. Must come from the grant type data.
            pageTitle: appConfig.name,
            // googleTagManagerKey: config.googleTagManagerKey,
            // analyticsTagKey: config.analyticsTagKey
        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init().then(r => console.log(r));
