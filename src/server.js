const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('../models'); // Sequelize instance from index.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Example route
app.get('/', (req, res) => {
  res.send('Portfolio API is running');
});

// Import routers
const holdingRoutes = require('./routes/holdings');
app.use('/holdings', holdingRoutes);



const yahooFinance = require('yahoo-finance2').default;

async function getStockData(ticker) {
  const quote = await yahooFinance.quoteSummary(ticker, { modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'earnings'] });

  const currentPrice = quote.financialData.currentPrice;
  const peRatio = quote.defaultKeyStatistics.trailingPE;
  const earnings = quote.earnings.earningsChart.quarterly;

  console.log("Current Price:", currentPrice);
  console.log("P/E Ratio:", peRatio);
  console.log("Earnings (Quarterly):", earnings);
}

getStockData('AAPL');

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });
