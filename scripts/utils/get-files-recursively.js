const getDirectories = require('./get-directories');
const getFiles = require('./get-files');

const getFilesRecursively = (p) => {
    const dirs = getDirectories(p);
    const files = dirs
        .map((dir) => getFilesRecursively(dir)) // go through each directory
        .reduce((a, b) => [...a, ...b], []); // map returns a 2d array (array of file arrays) so flatten
    return [...files, ...getFiles(p)];
};

module.exports = getFilesRecursively;
