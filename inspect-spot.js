const fs = require('fs');

const scriptJs = fs.readFileSync('D:/LiveIPO Option Selling Payment/script.js', 'utf8');
const adminJs = fs.readFileSync('D:/LiveIPO Option Selling Payment/admin.js', 'utf8');

console.log('--- script.js occurrences of _liveDhanSpot ---');
let pos = 0;
while ((pos = scriptJs.indexOf('_liveDhanSpot', pos)) !== -1) {
  console.log(`script.js at ${pos}:`, scriptJs.slice(pos - 40, pos + 120));
  pos += 14;
}

console.log('--- admin.js occurrences of _liveDhanSpot ---');
pos = 0;
while ((pos = adminJs.indexOf('_liveDhanSpot', pos)) !== -1) {
  console.log(`admin.js at ${pos}:`, adminJs.slice(pos - 40, pos + 120));
  pos += 14;
}
