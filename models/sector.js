'use strict';

module.exports = (sequelize, DataTypes) => {
  const Sector = sequelize.define('Sector', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Sectors',
    timestamps: true,
    underscored: true,
  });

  Sector.associate = function (models) {
    Sector.hasMany(models.Stock, {
      foreignKey: 'sectorId',
      onDelete: 'SET NULL', // optional, you can use 'CASCADE' or 'RESTRICT'
    });
  };

  return Sector;
};
