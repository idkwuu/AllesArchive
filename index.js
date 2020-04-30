const {SERVERNAME} = process.env;
const credentials = require("./credentials");
const fs = require("fs");

// Sequelize
const {Sequelize, DataTypes} = require("sequelize");
const db = new Sequelize(
	credentials.db.name,
	credentials.db.username,
	credentials.db.password,
	{
		host: credentials.db.host,
		dialect: "mariadb",
		logging: false,
		dialectOptions: {
			timezone: "Etc/GMT0"
		}
	}
);

// File Model
const File = db.define("episode", {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    primaryServer: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    updatedAt: false
});

// Express
const express = require("express");
const app = express();
db.sync().then(() => app.listen(8080));

// Base
app.get("/", (req, res) => {
    res.send(`AllesFS ${SERVERNAME}`);
});

// Get File
app.get("/:filename", (req, res) => {
    console.log(req.params.filename);
});