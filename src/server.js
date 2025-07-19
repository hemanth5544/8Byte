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
