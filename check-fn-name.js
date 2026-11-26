const fs = require('fs');
const scriptJs = fs.readFileSync('D:/LiveIPO Option Selling Payment/script.js', 'utf8');

const idx = scriptJs.indexOf('window._liveDhanSpot =');
const fnIdx = scriptJs.lastIndexOf('function', idx);
console.log('--- Function wrapping live ticker in script.js ---');
console.log(scriptJs.slice(fnIdx, fnIdx + 400));
