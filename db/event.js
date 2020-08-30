const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.Event = db.define(
    "event",
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
    },
    {
      updatedAt: false,
    }
  );

  // Client Association
  db.Client.hasMany(db.Event);
  db.Event.belongsTo(db.Client);

  // User Association
  db.User.hasMany(db.Event);
  db.Event.belongsTo(db.User);
};
