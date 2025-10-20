const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../public/_worker.js');
const dest = path.join(__dirname, '../.vercel/output/static/_worker.js');

if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log('✅ Copied _worker.js to build output');
} else {
  console.log('❌ _worker.js not found in public folder');
}