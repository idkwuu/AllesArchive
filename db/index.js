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

require("./account")(db);
require("./item")(db);
require("./status")(db);
