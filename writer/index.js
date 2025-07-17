const fs = require('fs');
const path = require('path');

// Path to shared file
const SHARED_FILE_PATH = '/usr/src/app/files/timestamp.txt';

function writeTimestamp() {
  const timestamp = new Date().toISOString();

  // Write timestamp to the shared file
  fs.writeFileSync(SHARED_FILE_PATH, timestamp);
  console.log(`Timestamp written to shared file: ${timestamp}`);
}

// Write a new timestamp every 5 seconds
setInterval(writeTimestamp, 5000);
writeTimestamp();
