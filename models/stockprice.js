'use strict';

module.exports = (sequelize, DataTypes) => {
  const StockPrice = sequelize.define('StockPrice', {
    stockId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Stocks',
        key: 'id',
      },
    },
    cmp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pe_ratio: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    latest_earnings: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fetched_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'StockPrices',
    timestamps: true,
    underscored: true,
  });

  StockPrice.associate = function (models) {
    StockPrice.belongsTo(models.Stock, {
      foreignKey: 'stockId',
      as: 'stock',
      onDelete: 'CASCADE',
    });
  };

  return StockPrice;
};
