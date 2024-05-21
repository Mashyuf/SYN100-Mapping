const fs = require('node:fs');

try {
    const data = fs.readFileSync('Personal Income by County - 2002.kml');
    console.log('read file success');
} catch (err) {
    console.log(err);
}