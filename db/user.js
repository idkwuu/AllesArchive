const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.User = db.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
      },
      bDay: {
        type: DataTypes.TINYINT,
      },
      bMonth: {
        type: DataTypes.TINYINT,
      },
      bYear: {
        type: DataTypes.SMALLINT,
      },
      plusEnd: {
        type: DataTypes.DATE,
      },
    },
    {
      updatedAt: false,
      paranoid: true,
    }
  );
};
