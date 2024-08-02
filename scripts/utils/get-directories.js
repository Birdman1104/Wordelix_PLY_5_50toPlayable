const { readdirSync } = require('fs');
const path = require('path');
const isDirectory = require('./is-directory');

module.exports = (p) =>
    readdirSync(p)
        .map((name) => path.join(p, name))
        .filter(isDirectory);
