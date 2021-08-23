const express = require('express');
const axios = require('axios');
const { PORT } = require('../config');

const router = express.Router();

// GET all balances
router.get('/', async (req, res) => {
  // Get unspent transactions
  try {
    const axRes = await axios.get(`http://localhost:${PORT}/transactions/unspent`);
    var data = axRes.data;
  } catch (err) {
    res.json({ message: `Error in balance GET route: ${err}` });
  }

  // For each payer, add up points in balance object
  //  Key: payer
  //  Value: points (total)
  balances = {};
  data.forEach(o => {
    balances[o.payer] = balances[o.payer] ? balances[o.payer] + o.points : o.points;
  });

  // Return balances object
  res.json(balances);

});

module.exports = router;