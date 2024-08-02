const generateEventNames = require('./utils/generate-event-names');
const generateAssets = require('./utils/generate-assets');
const generateAtlases = require('./utils/generate-atlases');

module.exports = async () => {
    console.log('Starting atlases generation...');
    await generateAtlases();
    console.log('Atlases generation is done!');

    console.log('Starting assets generation...');
    generateAssets();
    console.log('Assets generation is done!');
};
