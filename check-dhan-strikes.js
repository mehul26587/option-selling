const fs = require('fs');
const js = fs.readFileSync('D:/LiveIPO Option Selling Payment/script.js', 'utf8');

const idx = js.indexOf('const DHAN_LIVE_DATA_NIFTY =');
console.log(js.slice(idx, idx + 1200));
