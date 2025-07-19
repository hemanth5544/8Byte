'use strict';

module.exports = (sequelize, DataTypes) => {
  const Holding = sequelize.define('Holding', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Use table name
        key: 'id',
      },
    },
    stockId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Stocks',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: 'Holdings',
    timestamps: true,
    underscored: true,
  });

  // Define associations
  Holding.associate = function (models) {
    Holding.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });

    Holding.belongsTo(models.Stock, {
      foreignKey: 'stockId',
      as: 'stock',
      onDelete: 'CASCADE',
    });
  };

  return Holding;
};
