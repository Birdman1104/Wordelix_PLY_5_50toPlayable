const { unlinkSync } = require('fs');
const getFiles = require('./get-files');

module.exports = (p) => getFiles(p).forEach((el) => unlinkSync(el));
