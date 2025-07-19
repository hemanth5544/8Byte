// config/database.js
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  logging: true, // Disable logging if you prefer
});

module.exports = sequelize;
