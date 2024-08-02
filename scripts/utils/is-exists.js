const { existsSync } = require('fs');

module.exports = (p) => existsSync(p);
