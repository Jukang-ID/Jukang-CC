const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const port = process.env.PORT || 8080;
    const server = Hapi.server({
        port: port,
        host: '0.0.0.0',
    });

    server.route(routes);
    

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();