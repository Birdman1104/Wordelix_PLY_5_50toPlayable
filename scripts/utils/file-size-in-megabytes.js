const path = require('path');
const fs = require('fs');
const junk = require('junk');

const MB = 1000 * 1000;

module.exports = (file) => {
    const stats = fs.statSync(file);
    if (!stats.isDirectory()) {
        return stats.size / MB;
    }
    const files = fs.readdirSync(file).filter(junk.not);
    return (
        files.reduce((prev, f) => {
            const s = fs.statSync(path.resolve(path.join(file, f)));
            return prev + s.size;
        }, 0) / MB
    );
};
