const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.Artist = db.define(
    "artist",
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
    },
    {
      timestamps: false,
    }
  );
};
