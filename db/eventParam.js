const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.EventParam = db.define(
    "eventParam",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Event Association
  db.Event.hasMany(db.EventParam);
  db.EventParam.belongsTo(db.Event);
};
