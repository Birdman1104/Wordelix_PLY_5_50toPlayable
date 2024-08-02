const { merge } = require('webpack-merge');
// const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = () => {
    return merge(common(), {
        context: process.cwd(), // to automatically find tsconfig.json
        mode: 'development',
        plugins: [
            // new ForkTsCheckerWebpackPlugin({
            //     eslint: { enabled: true, files: './src/**/*.{ts,js}' },
            //     typescript: {
            //         diagnosticOptions: {
            //             semantic: true,
            //             syntactic: true,
            //         },
            //     },
            // }),
            // new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false }),
        ],
        devtool: 'eval-cheap-module-source-map',
    });
};
