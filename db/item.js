const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.Item = db.define(
    "item",
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      explicit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      duration: {
        type: DataTypes.MEDIUMINT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
