const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.Account = db.define(
    "account",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      alles: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      access: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
      paranoid: true,
    }
  );
};
