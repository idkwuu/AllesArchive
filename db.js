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
            timezone: "Etc/GMT0"
        }
    }
);

module.exports = db.define("user", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING
    },
    data: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    cachedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

db.sync();