const express = require('express');
const router = express.Router();
const { Holding, User, Stock } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const holdings = await Holding.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Stock, as: 'stock', attributes: ['id', 'name', 'ticker_symbol'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(holdings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
