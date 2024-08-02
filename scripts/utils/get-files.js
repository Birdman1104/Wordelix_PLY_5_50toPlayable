const { readdirSync } = require('fs');
const path = require('path');
const isFile = require('./is-file');
const junk = require('junk');

module.exports = (p) =>
    readdirSync(p)
        .filter(junk.not)
        .map((name) => path.join(p, name))
        .filter(isFile);
