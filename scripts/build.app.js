const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const path = require('path');
const fileSizeInMegabytes = require('./utils/file-size-in-megabytes');
const common = require('./common.app');
const getImageLoaderConfig = require('./utils/get-image-loader-config');

(async function () {
    await common();
    const spinner = ora(chalk.yellowBright(`Bundling...`)).start();
    webpack(require(`../webpack/webpack.prod`)(getImageLoaderConfig()), (err, stats) => {
        spinner.stop();
        // uncomment this for more build logs
        console.log(
            stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true, // Shows colors in the console
            }),
        );
        if (err) {
            console.log(chalk.redBright(`🛑 ${err.message}`));
            return;
        }
        const limit = 2.99;
        const size = fileSizeInMegabytes(path.resolve(path.join('dist', 'index.html')));
        console.log(chalk.greenBright(`${size <= limit ? '✅' : '⚠️'} Bundle size is ${size.toFixed(2)} MB`));
    });
})();
