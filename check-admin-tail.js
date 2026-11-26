const fs = require('fs');
const js = fs.readFileSync('D:/LiveIPO Option Selling Payment/admin.js', 'utf8');

const endOfAdmin = js.slice(js.length - 1200);
console.log('--- BOTTOM OF ADMIN.JS ---');
console.log(endOfAdmin);
