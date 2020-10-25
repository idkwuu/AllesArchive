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
db.sync();

module.exports = db.define("status", {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false
    },
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    end: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false
});