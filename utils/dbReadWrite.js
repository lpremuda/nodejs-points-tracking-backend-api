const fs = require('fs').promises;

// Read from database (e.g. mock-db-*.json)
async function readFromDb(dbPath) {
  let data;
  try {
    const dbResult = await fs.readFile(dbPath);
    data = JSON.parse(dbResult);
  } catch (err) {
    console.log(err);
    data = 'Error';
  }
  return data;
};

// Write to database (e.g. mock-db-*.json)
async function writeToDb(dbPath, data) {
  try {
    // Enabled pretty print so the mock-db-*.json files are easier to read
    dataToWrite = JSON.stringify(data, null, 2);
    const result = await fs.writeFile(dbPath, dataToWrite);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  readFromDb,
  writeToDb
};