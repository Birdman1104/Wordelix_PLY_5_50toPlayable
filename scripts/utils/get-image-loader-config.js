const clamp = require('./clamp');
const { sync: globSync } = require('glob');
const minimatch = require('minimatch');
const isFile = require('./is-file');
const path = require('path');

module.exports = () => {
    const compression = {
        'assets/images/**/*.jpg': 80,
        'assets/images/**/*.png': [80, 90],
    };
    const paths = Object.keys(compression);
    let map = paths.map((p) => {
        return { source: p, files: globSync(p).filter((f) => isFile(f)) };
    });

    map.forEach((m1) => {
        map.forEach((m2) => {
            if (m1 === m2) {
                return;
            }

            if (minimatch(m1.source, m2.source)) {
                m1.files.forEach((m1file) => {
                    const found = m2.files.find((m2file) => m2file === m1file);
                    if (found) {
                        m2.files.splice(m2.files.indexOf(found), 1);
                    }
                });
            }
        });
    });

    return map
        .filter((m) => m.files.length > 0)
        .reduce((acc, m) => {
            const { source, files } = m;

            files.forEach((f) => {
                console.warn(f);
                acc.push(getImageLoaderEntryConfig(compression[source], path.resolve(f)));
            });

            return acc;
        }, []);
};

function getImageLoaderEntryConfig(qual, test) {
    return {
        test: test,
        use: {
            loader: 'image-webpack-loader',
            options: {
                disable: false,
                mozjpeg: {
                    progressive: true,
                    quality: convertJpgQual(qual),
                },
                optipng: {
                    enabled: true,
                },
                pngquant: {
                    quality: convertPngQual(qual),
                    speed: 1,
                },
            },
        },
    };
}

function convertJpgQual(rawJpgQual) {
    return clamp(Math.floor(rawJpgQual), 10, 100);
}

function convertPngQual(rawPngQual) {
    const { 0: min, 1: max } = rawPngQual;

    return [min * 0.01, max * 0.01];
}
