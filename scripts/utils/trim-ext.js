const path = require('path');

module.exports = (str) => str.replace(path.extname(str), '');
