const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const pixiCorePackageJson = require(path.join(process.cwd(), 'node_modules', '@pixi/core/package.json'));
const packagejson = require('../package.json');

module.exports = (loader = 'file') => {
    return {
        entry: {
            app: './src/index.js',
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: packagejson.name,
                template: path.resolve(path.join('html', 'index.hbs')),
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: `${loader}-loader`,
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(mp3|m4a)$/,
                    use: [
                        {
                            loader: `${loader}-loader`,
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff)$/,
                    use: [`${loader}-loader`],
                },

                {
                    // Include ts, tsx, js, and jsx files.
                    test: /\.(ts|js)x?$/,
                    exclude:
                        /node_modules\/(?!(@pixi|@armathai\/pixi-tween|@armathai\/pixi-particles|@armathai\/pixi-sound)\/).*/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: { version: 3, proposals: true },
                                    targets: {
                                        browsers: ['safari >= 4'],
                                    },
                                    bugfixes: true,
                                    // debug: true,
                                },
                            ],
                            '@babel/preset-typescript',
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties'],
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve('dist'),
        },
    };
};
