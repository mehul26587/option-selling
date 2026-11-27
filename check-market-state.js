const fs = require('fs');
const js = fs.readFileSync('D:/LiveIPO Option Selling Payment/admin.js', 'utf8');

const idx = js.indexOf('window._liveMarketState =');
console.log(js.slice(idx, idx + 1400));
