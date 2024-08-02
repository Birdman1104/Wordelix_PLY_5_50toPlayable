const path = require('path');
const { readdirSync, writeFileSync, readFileSync } = require('fs');
const { packAsync } = require('free-tex-packer-core');
const getFilesRecursively = require('./get-files-recursively');
const isDirectory = require('./is-directory');
const cleanFiles = require('./clean-files');
const isExists = require('./is-exists');

module.exports = async () => {
    const packDefaultOptions = {
        width: 4096,
        height: 4096,
        fixedSize: false,
        powerOfTwo: false,
        padding: 2,
        extrude: 1,
        allowRotation: false,
        detectIdentical: true,
        allowTrim: true,
        trimMode: 'trim',
        alphaThreshold: 0,
        removeFileExtension: false,
        prependFolderName: true,
        base64Export: false,
        scale: 1,
        scaleMethod: 'BILINEAR',
        packer: 'OptimalPacker',
        exporter: 'Pixi',
        filter: 'none',
    };

    const outputPath = path.join('assets', 'atlases');
    const inputPath = path.join('assets', 'atlases');

    if (!isExists(inputPath)) {
        return;
    }

    if (!isExists(outputPath)) {
        cleanFiles(outputPath);
    }

    const atlases = readdirSync(inputPath).filter((f) => isDirectory(path.join(inputPath, f)));
    for await (const a of atlases) {
        const atlasRoot = path.join(inputPath, a);
        const files = getFilesRecursively(atlasRoot).filter((f) => f.match(/.*\.(png|jpe?g)/gi));
        let textureFormat = 'jpg';
        const images = files.map((filePath) => {
            const imagePath = filePath.replace(path.join(atlasRoot, '/'), '');
            if (textureFormat !== 'png') {
                textureFormat = filePath.split('.').pop() === 'png' ? 'png' : 'jpg';
            }
            return {
                path: imagePath,
                contents: readFileSync(filePath),
            };
        });

        const packFiles = await packAsync(images, {
            ...packDefaultOptions,
            textureName: `${a}`,
            textureFormat,
        });
        packFiles.forEach((packFile) => writeFileSync(path.join(outputPath, packFile.name), packFile.buffer));
    }
};
