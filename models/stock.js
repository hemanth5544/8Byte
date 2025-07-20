'use strict';

module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticker_symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    exchange: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Sectors',
        key: 'id',
      },
    },
  }, {
    tableName: 'Stocks',
    timestamps: true,
    underscored: true,
  });

  Stock.associate = function (models) {
    Stock.belongsTo(models.Sector, {
      foreignKey: 'sectorId',
      as: 'sector',
      onDelete: 'SET NULL',
    });

    Stock.hasMany(models.Holding, {
      foreignKey: 'stockId',
      onDelete: 'CASCADE',
    });

    Stock.hasMany(models.StockPrice, {
      foreignKey: 'stockId',
      onDelete: 'CASCADE',
    });
  };

  return Stock;
};
