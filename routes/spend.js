const express = require('express');
const axios = require('axios');
const { readFromDb, writeToDb } = require('../utils/dbReadWrite');
const { PORT, dbUnspentTransactionsPath: dbPath } = require('../config');

const router = express.Router();

// POST
router.post('/', async (req, res) => {
  let spend = req.body.spend;

  // Return 400 status if 'spend' key isn't present in json object
  if (!spend) {
    return res.status(400).json({ message: 'Error: Object key \'spend\' not present' });
  }

  if (spend <= 0) {
    return res.status(400).json({ message: 'Error: \'spend\' needs to be greater than 0' });
  }

  // Get total balance
  const totalBalance = await getTotalBalance();
  if (totalBalance < spend) {
    return res.status(400).json({ message: `Error: spend amount of ${spend} points is larger than the current total balance of ${totalBalance} points. Enter a value that is less than or equal to ${totalBalance} points` });
  }

  // Read from database (mock-db-unspent-transactions.json)
  const data = await readFromDb(dbPath);
  if (data === 'Error') {
    return res.status(500).json({ message: `Error reading data from ${dbPath} in spend POST route` });
  }

  // Sort array of objects by "timestamp" key
  // sortedData[0] is earliest timestamp
  sortedData = data.sort(compareTimestamps);

  iPos = 0;
  const spentPoints = {};
  const unSpentTranactions = sortedData.reduce((accum, el) => {
    // If transaction object has 0 points or spend is <=0, then return the current transaction object
    if (el.points === 0 || spend <= 0) {
      accum.push(el);
      return accum;
    }
    if (spend >= el.points) {
      spentPoints[el.payer] = spentPoints[el.payer] ? spentPoints[el.payer] - el.points : -el.points;
      spend -= el.points;
      el.points = 0;
    } else {
      spentPoints[el.payer] = spentPoints[el.payer] ? spentPoints[el.payer] - spend : -spend;
      el.points -= spend;
      spend = 0;
    }
    accum.push(el);
    return accum;
  }, []);

  // Write data to database
  await writeToDb(dbPath, unSpentTranactions);
  
  // Respond with spent points
  res.json(spentPoints);

});

async function getTotalBalance() {

  // Get balances for each payer
  const balancesRet = await axios.get(`http://localhost:${PORT}/balances`);
  if (balancesRet.status != 200) {
    return res.status(500).json({ message: 'Error getting balances from /balances route via the spend POST route' });
  }
  const balances = balancesRet.data;

  // Sum up points from all payers
  const totalBalance = Object.values(balances).reduce((total, el) => {
    return total + el;
  }, 0);

  return totalBalance;
}

function compareTimestamps(obj1, obj2) {
  if (obj1.timestamp < obj2.timestamp) {
    return -1;
  } else if (obj1.timestamp > obj2.timestamp) {
    return 1;
  } else {
    return 0;
  }
}

module.exports = router;