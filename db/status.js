const { DataTypes } = require("sequelize");

module.exports = (db) => {
  db.Status = db.define(
    "status",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      playing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      progress: {
        type: DataTypes.MEDIUMINT,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
    }
  );

  db.Account.hasMany(db.Status);
  db.Status.belongsTo(db.Account);

  db.Item.hasMany(db.Status);
  db.Status.belongsTo(db.Item);
};
