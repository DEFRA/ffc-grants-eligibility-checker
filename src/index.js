import Hapi from '@hapi/hapi';
import { getGrantType } from './http/routes/grantType/grantType.js';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    server.route({
        method: 'GET',
        path: '/{grantType}',
        handler: () => {
            return getGrantType();
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init().then(r => console.log(r));
