const express = require('express');
const { readFromDb, writeToDb } = require('./utils/dbReadWrite');

const balancesRouter = require('./routes/balances');
const transactionsRouter = require('./routes/transactions');
const spendRouter = require('./routes/spend');

const { PORT,
  dbAllTransactionsPath,
  dbUnspentTransactionsPath,
  dbOriginalTransactionsPath } = require('./config');

initializeDatabases();

app = express();

// Use middleware
app.use(express.json());

// Use routes
app.use('/transactions', transactionsRouter);
app.use('/balances', balancesRouter);
app.use('/spend', spendRouter);

// Root route
app.get('/test', (req, res) => {
  res.json({ message: "It worked!" });
});

// Listen
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

async function initializeDatabases() {
  // Initialize data in 'all-transactions' and 'unspent-transactions'
  const origJSONData = await readFromDb(dbOriginalTransactionsPath);
  await writeToDb(dbAllTransactionsPath, origJSONData);
  await writeToDb(dbUnspentTransactionsPath, origJSONData);
}