const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const Sequelize = require("sequelize");
const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mariadb",
  logging: false,
  dialectOptions: {
    timezone: "Etc/GMT0",
  },
});
module.exports = db;

require("./account")(db);
require("./item")(db);
require("./status")(db);
require("./artist")(db);
require("./artist_item")(db);
