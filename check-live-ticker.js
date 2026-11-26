const fs = require('fs');
const scriptJs = fs.readFileSync('D:/LiveIPO Option Selling Payment/script.js', 'utf8');

const idx = scriptJs.indexOf('window._liveDhanSpot =');
console.log(scriptJs.slice(idx - 200, idx + 600));
