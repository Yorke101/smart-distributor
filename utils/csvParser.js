const fs = require('fs');
const csv = require('csv-parser');

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => contacts.push(data))
      .on('end', () => resolve(contacts))
      .on('error', reject);
  });
}

module.exports = parseCSV;