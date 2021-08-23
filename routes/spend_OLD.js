const express = require('express');
const axios = require('axios');
const PORT = require('../config').PORT;

const router = express.Router();

// POST
router.post('/', async (req, res) => {
  const spend = req.body.spend;

  // Exit out of function if spend key isn't present in json object
  if (!spend) {
    return res.status(400).json({ message: 'Error: Object key \'spend\' not present' });
  }

  // Get all transactions
  try {
    const axRes = await axios.get(`http://localhost:${PORT}/unSpentTransactions`);
    var data = axRes.data;
    res.json(data);
  } catch (err) {
    res.json({ message: `Error in spend POST route: ${err}` });
  }

  // Sort array of objects by "timestamp" key
  // sortedData[0] is earliest timestamp
  sortedData = data.sort(compareTimestamps);



});

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