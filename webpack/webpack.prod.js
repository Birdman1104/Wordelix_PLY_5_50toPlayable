const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const LIBS_TO_EXCLUDE = ['pixi-stats'];

module.exports = (imageLoaderConfig) => {
    const commonConfigs = common('url');
    [...LIBS_TO_EXCLUDE].forEach((lib) => {
        delete commonConfigs.entry[lib];
    });
    const mergedConfig = merge(commonConfigs, {
        mode: 'production',
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    },
                },
            },
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
                        },
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
        },
        plugins: [new ScriptExtHtmlWebpackPlugin({ inline: /\.js$/ })],
        module: {
            rules: [...imageLoaderConfig],
        },
    });
    return mergedConfig;
};
