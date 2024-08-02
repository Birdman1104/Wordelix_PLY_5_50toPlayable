const path = require('path');
const { writeFileSync, readFileSync } = require('fs');
const { execSync } = require('child_process');
const getDirectories = require('./get-directories');
const getFilesRecursively = require('./get-files-recursively');
const getFiles = require('./get-files');
const trimExt = require('./trim-ext');
const camelize = require('./camelize');

const cwd = process.cwd();

function processImages(p) {
    const files = getFilesRecursively(p);
    let images = '';
    const value = files.reduce((str, image) => {
        const key = path.relative(p, image);
        const value = image.replace(cwd, '..');
        images += `'${trimExt(key)}':'${key}',`;
        str += `'${key}':require('${value}').default,`;
        return str;
    }, '');
    return [value, images];
}

function processSounds(p) {
    const files = getFilesRecursively(p);
    let sounds = '';
    const value = files.reduce((str, sound) => {
        const key = path.basename(sound, path.extname(sound));
        const value = sound.replace(cwd, '..');
        sounds += `'${key}':'../assets/sounds/${key}.mp3',`;
        str += `'${key}':require('${value}').default,`;
        return str;
    }, '');

    return [value, sounds];
}

function processSpines(p) {
    const files = getFilesRecursively(p);
    let spines = '';
    const value = files.reduce((str, spine) => {
        const spineStr = readFileSync(spine, 'utf-8');
        const spineJson = JSON.parse(spineStr);
        const { animations } = spineJson;
        const animationsString = Object.keys(animations).reduce(
            (acc, animation) => `${acc}'${camelize(animation)}':'${animation}',`,
            '',
        );
        const key = path.basename(spine, path.extname(spine));
        const value = `{
            json: require('${spine.replace(cwd, '..')}'),
            scale: 1,
            skeleton: null as PIXI.spine.core.SkeletonData,
        }`;
        spines += `'${key}': {
            'animations':{${animationsString}},
            'skeleton': null as PIXI.spine.core.SkeletonData,
        },`;
        str += `'${key}':${value},`;
        return str;
    }, '');

    return [value, spines];
}

function processParticles(p) {
    const files = getFilesRecursively(p);
    let particles = '';
    const value = files.reduce((str, particle) => {
        const key = path.basename(particle, path.extname(particle));
        const value = particle.replace(cwd, '..');
        particles += `'${key}':assets.particles['${key}'],`;
        str += `'${key}':require('${value}'),`;
        return str;
    }, '');
    return [value, particles];
}

function processAtlases(p) {
    const files = getFiles(p).filter((f) => path.extname(f) === '.json');
    let atlases = '';

    const value = files.reduce((str, jsonFile) => {
        const key = path.basename(jsonFile, path.extname(jsonFile));
        const jsonStr = readFileSync(jsonFile, 'utf-8');
        const json = JSON.parse(jsonStr);
        const { meta, frames } = json;
        const value = `{
            json: require('${jsonFile.replace(cwd, '..')}'),
            image: require('${jsonFile.replace(cwd, '..').replace('.json', path.extname(meta.image))}').default,
        }`;

        if (jsonFile.includes('.png')) {
            str += `'${key}':${value},`;
            atlases += `'${trimExt(key)}': '${key}',`;
        } else {
            atlases += Object.keys(frames).reduce((str, f) => (str += `'${trimExt(f)}':'${f}',`), '');
            str += `'${key}':${value},`;
        }

        return str;
    }, '');
    return [value, atlases];
}

module.exports = () => {
    const directories = getDirectories(path.resolve('assets'));

    let images = '';
    let sounds = '';
    let particles = '';
    let spines = '';

    let assets = `
    'images': {},
    'particles': {},
    'sounds': {},
    'spines': {},
    'atlases': {},
    `;

    directories.forEach((d) => {
        const type = path.basename(d);
        switch (type) {
            case 'images':
                {
                    const processedImages = processImages(d);
                    assets = assets.replace(`'images': {},`, `'images':{${processedImages[0]}},`);
                    images += processedImages[1];
                }
                break;
            case 'sounds':
                {
                    const processedSounds = processSounds(d);
                    assets = assets.replace(`'sounds': {},`, `'sounds':{${processedSounds[0]}},`);
                    sounds = processedSounds[1];
                }
                break;
            case 'particles':
                {
                    const processedParticles = processParticles(d);
                    assets = assets.replace(`'particles': {},`, `'particles':{${processedParticles[0]}},`);
                    particles = processedParticles[1];
                }
                break;
            case 'spines':
                {
                    const processedSpines = processSpines(d);
                    assets = assets.replace(`'spines': {},`, `'spines':{${processedSpines[0]}},`);
                    spines = processedSpines[1];
                }
                break;
            case 'atlases':
                {
                    const processedAtlases = processAtlases(d);
                    assets = assets.replace(`'atlases': {},`, `'atlases':{${processedAtlases[0]}},`);
                    images += processedAtlases[1];
                }
                break;

            default:
                throw Error(`Unknown asset type "${type}"`);
        }
    });

    const result = `
    /* eslint-disable @typescript-eslint/naming-convention */

    export const assets = {${assets}}

    export const Images = {${images}}

    export const Sounds = {${sounds}}

    export const Particles = {${particles}}

    export const Spines = {${spines}}
    
    ${
        spines.length > 0
            ? `Object.keys(Spines).forEach((key) => {
                const k = key as keyof typeof Spines;
                delete Spines[k]['skeleton'];
                Object.defineProperty(Spines[k], 'skeleton', {
                    get(): PIXI.spine.core.SkeletonData {
                        return assets.spines[k].skeleton;
                    },
                });
            });`
            : ''
    }
  
    `;

    const url = path.resolve('src/assets.ts');
    writeFileSync(url, result, 'utf-8');
    execSync(`npx prettier --write ${url}`);
};
