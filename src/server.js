const Hapi = require('@hapi/hapi');
const routes = require('./routes');
// const loadModel = require('./services/loadmodel');
const init = async () => {
    const port = process.env.PORT || 8080;
    const server = Hapi.server({
        port: port,
        host: '0.0.0.0',
    });

    server.route(routes);
    // const model = await loadModel();
    // server.app.model = model;
    // if (!server.app.model) {
    //     console.error('Model tidak tersedia. Pastikan proses pemuatan model berhasil.');
    // }

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();