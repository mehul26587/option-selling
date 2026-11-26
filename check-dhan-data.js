const fs = require('fs');

const adminJs = fs.readFileSync('D:/LiveIPO Option Selling Payment/admin.js', 'utf8');
const scriptJs = fs.readFileSync('D:/LiveIPO Option Selling Payment/script.js', 'utf8');

console.log('DHAN_LIVE_DATA_NIFTY in admin.js:', adminJs.includes('DHAN_LIVE_DATA_NIFTY'));
console.log('DHAN_LIVE_DATA_NIFTY in script.js:', scriptJs.includes('DHAN_LIVE_DATA_NIFTY'));

const idx = adminJs.indexOf('DHAN_LIVE_DATA_NIFTY');
console.log('admin.js index:', idx);
if (idx !== -1) console.log(adminJs.slice(idx - 50, idx + 200));

const sIdx = scriptJs.indexOf('DHAN_LIVE_DATA_NIFTY');
console.log('script.js index:', sIdx);
if (sIdx !== -1) console.log(scriptJs.slice(sIdx - 50, sIdx + 200));
