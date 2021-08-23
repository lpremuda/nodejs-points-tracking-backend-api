const express = require('express');
const { readFromDb, writeToDb } = require('../utils/dbReadWrite');
const fs = require('fs').promises;

const { dbAllTransactionsPath, dbUnspentTransactionsPath } = require('../config');

const router = express.Router();

// Redirect to /transactions/all if /transactions is requested 
router.get('/', (req, res) => {
  res.redirect('/transactions/all');
})

// GET all transactions
router.get('/all', async (req, res) => {
  // Read from database (i.e. mock-db.json)
  const data = await readFromDb(dbAllTransactionsPath);
  if (data != 'Error') {
    res.json(data);    
  } else {
    res.json({ message: `Error in /transactions/all GET route: ${err}` });
  }
});

// GET unspent transactions
router.get('/unspent', async (req, res) => {
  // Read from database (i.e. mock-db.json)
  const data = await readFromDb(dbUnspentTransactionsPath);
  if (data != 'Error') {
    res.json(data);    
  } else {
    res.json({ message: `Error in /transactions/unspent GET route: ${err}` });
  }
});

// POST
router.post('/', async (req, res) => {
  const inputPayload = req.body;
  const keys = Object.keys(inputPayload);

  // Incoming JSON object must have 2 keys and be named 'payer' and 'points'
  if (keys.length != 2 || !keys.includes('payer') || !keys.includes('points')) {
    return res.json({ message: 'Error: /transactions POST request must only include \'payer\' and \'points\' in the JSON object' });
  }

  // Add date string to object
  const completePayload = {...inputPayload, date: new Date().toISOString() };
  
  // Add data to database (mock-db-all-transactions.json)
  let { result, data } = await addDataToDb(dbAllTransactionsPath, completePayload);
  if (result === 1) {
    res.json({ message: `Error reading data from ${dbAllTransactionsPath} in transactions POST route` });
  }

  // Add data to database (mock-db-unspent-transactions.json)
  let { resultUnspent } = await addDataToDb(dbUnspentTransactionsPath, completePayload);
  if (resultUnspent === 1) {
    res.json({ message: `Error reading data from ${dbUnspentTransactionsPath} in transactions POST route` });
  }

  // Return data from all transactions
  res.json(data);
});

async function addDataToDb(dbPath, payload) {
  let retVal = 0;

  // Read from database
  const data = await readFromDb(dbPath);
  if (data === 'Error') {
    retVal = 1;
    return { retVal: retVal, data: data };
  }

  // Add new transaction to data array
  data.push(payload);

  // Write to database
  await writeToDb(dbPath, data);

  // Return values
  return { retVal: retVal, data: data };
} 

module.exports = router;