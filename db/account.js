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
      connected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      current: {
        type: DataTypes.TEXT,
      },
      checkedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
    }
  );
};
