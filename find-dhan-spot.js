const fs = require('fs');

['script.js', 'admin.js', 'admin.html', 'index.html'].forEach(f => {
  const c = fs.readFileSync('D:/LiveIPO Option Selling Payment/' + f, 'utf8');
  const matches = c.match(/_liveDhanSpot[a-zA-Z0-9_ =.()]*/g);
  console.log(`--- ${f} _liveDhanSpot matches ---`);
  console.log(matches);
});
