const Sequelize = require("sequelize");
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
    logging: false,
    dialectOptions: {
      timezone: "Etc/GMT0",
    },
  }
);
module.exports = db;

db.Friendship = db.define(
  "friendship",
  {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    user1: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    user2: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    requestedAt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    acceptedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  }
);
