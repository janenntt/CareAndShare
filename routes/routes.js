const path = require('path');

function pathToHtml(filename) {
    return path.join(__dirname, '../public', filename);
}

exports.pathToHtml = pathToHtml;