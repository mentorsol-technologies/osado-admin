const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../public/_worker.js');
const dest = path.join(__dirname, '../.vercel/output/static/_worker.js');

// Check if source exists
if (!fs.existsSync(source)) {
  console.log('❌ _worker.js not found in public folder');
  process.exit(1);
}

// Check if destination directory exists
const destDir = path.dirname(dest);
if (!fs.existsSync(destDir)) {
  console.log('❌ Destination directory does not exist:', destDir);
  process.exit(1);
}

// Copy the file
try {
  fs.copyFileSync(source, dest);
  console.log('✅ Copied _worker.js to build output');
} catch (error) {
  console.error('❌ Error copying _worker.js:', error.message);
  process.exit(1);
}