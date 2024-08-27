import Hapi from '@hapi/hapi';
import {app as appConfig, views as viewConfig} from "./config";
import { getGrantType } from './http/routes/grantType/grantType.js';
import path from "path";
import {compile, configure} from "nunjucks";
import {getRouteDefinitions} from "./http/routes/routes.js";

const init = async () => {
    const server = Hapi.server({
        port: appConfig.port,
        host: appConfig.host,
    });

    const routes = getRouteDefinitions();
    routes.forEach(route => server.route(route))

    server.views({
        engines: {
            njk: {
                compile: (src, options) => {
                    const template = compile(src, options.environment)
                    return context => template.render(context)
                }
            }
        },
        relativeTo: __dirname,
        compileOptions: {
            environment: configure(viewConfig.paths)
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
