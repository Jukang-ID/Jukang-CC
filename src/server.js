const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8000, // Gunakan PORT dari environment variable jika ada
        host: '0.0.0.0', // Setting host ke 0.0.0.0 untuk deployment di Vercel
    });

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();