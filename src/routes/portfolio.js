const express = require('express');
const router = express.Router();
const { User, Holding, Stock, Sector, StockPrice } = require('../../models/index');
const { Op } = require('sequelize');

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const holdings = await Holding.findAll({
      where: { userId },
      include: [
        {
          model: Stock,
          include: [Sector, {
            model: StockPrice,
            order: [['fetched_at', 'DESC']],
            limit: 1
          }]
        }
      ]
    });

    if (!holdings.length) {
      return res.status(404).json({ message: 'No holdings found for this user' });
    }

    // Calculate total investment for percentage calculation
    const totalInvestment = holdings.reduce((acc, h) => {
      return acc + (h.purchase_price * h.quantity);
    }, 0);

    // Group holdings by sector
    const grouped = {};

    for (const holding of holdings) {
      const stock = holding.Stock;
      const sector = stock.Sector?.name || 'Uncategorized';
      const price = stock.StockPrices[0];
      const cmp = price?.cmp || 0;
      const pe_ratio = price?.pe_ratio || null;
      const latest_earnings = price?.latest_earnings || null;

      const investment = holding.purchase_price * holding.quantity;
      const presentValue = cmp * holding.quantity;
      const gainLoss = presentValue - investment;
      const portfolioPercent = totalInvestment > 0 ? (investment / totalInvestment) * 100 : 0;

      const stockData = {
        name: stock.name,
        exchange: stock.exchange,
        quantity: holding.quantity,
        purchase_price: holding.purchase_price,
        investment,
        cmp,
        present_value: presentValue,
        gain_loss: gainLoss,
        portfolio_percent: parseFloat(portfolioPercent.toFixed(2)),
        pe_ratio,
        latest_earnings,
        color: gainLoss >= 0 ? 'green' : 'red',
      };

      if (!grouped[sector]) {
        grouped[sector] = {
          sector,
          totalInvestment: 0,
          totalPresentValue: 0,
          gainLoss: 0,
          stocks: []
        };
      }

      grouped[sector].totalInvestment += investment;
      grouped[sector].totalPresentValue += presentValue;
      grouped[sector].gainLoss += gainLoss;
      grouped[sector].stocks.push(stockData);
    }

    const result = Object.values(grouped);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
