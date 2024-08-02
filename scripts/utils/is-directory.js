const { statSync } = require('fs');

module.exports = (p) => statSync(p).isDirectory();
