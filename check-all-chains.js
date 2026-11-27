const fs = require('fs');
const js = fs.readFileSync('D:/LiveIPO Option Selling Payment/admin.js', 'utf8');

const idx = js.indexOf('function renderAllSensibullChains');
console.log(js.slice(idx, idx + 400));
