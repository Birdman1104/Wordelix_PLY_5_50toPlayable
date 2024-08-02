const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../webpack/webpack.dev')();
const common = require('./common.app');

(async function () {
    const port = 8080;
    try {
        await common();

        const server = new WebpackDevServer(webpack(devConfig), {
            // watchOptions: { aggregateTimeout: 0, ignored: /assets/, poll: true },
            watchOptions: { aggregateTimeout: 0, poll: true },
            stats: { all: false, error: true, colors: true },
            clientLogLevel: 'error',
            hot: true,
            overlay: true,
            publicPath: '/',
            public: require('ip').address() + ':' + port,
        });
        server.listen(port);
    } catch (err) {
        console.error(err);
    }
})();
