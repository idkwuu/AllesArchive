const {SERVERNAME} = process.env;
const credentials = require("./credentials");
const idLength = 125;
const fs = require("fs");
const randomString = require("randomstring").generate;

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

// Client Model
const Client = db.define("client", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

// File Model
const File = db.define("file", {
    id: {
        type: DataTypes.STRING(128),
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
File.hasOne(Client);

// Express
const express = require("express");
const app = express();
const formidable = require("formidable");
db.sync().then(() =>
    app.listen(8080, () =>
        console.log("Server is online.")
    )
);

// Base
const homepage = fs.readFileSync(`${__dirname}/index.html`, "utf8")
    .replace(/SERVERNAME/g, SERVERNAME);
app.get("/", (req, res) => res.send(homepage));

// Client Authorization
app.use(async (req, res, next) => {
    const header = req.headers.authorization;
    if (typeof header !== "string") return next();
    if (header.split(" ").length !== 2 || !header.startsWith("Basic ")) return next();

    // Parse Header
    let credentials;
    try {
        const credentialsString = Buffer.from(header.split(" ")[1], "base64").toString();
        if (credentialsString.split(":").length !== 2) return next();
        credentials = {
            id: credentialsString.split(":")[0],
            secret: credentialsString.split(":")[1]
        };
    } catch (err) {
        return next();
    }

    // Get Client
    const client = await Client.findOne({
        where: {
            id: credentials.id
        }
    });
    if (!client || client.secret !== credentials.secret) return next();
    
    req.authClient = client;
    next();
});

// Get File
app.get("/:filename", (req, res) => {
    console.log(req.params.filename);
});

// Upload File
app.post("/", (req, res) => {
    if (!req.authClient) return res.status(401).send("Unauthorized");
    const form = formidable();

    form.parse(req, (err, fields, file) => {
        if (err) return res.status(400).send("Failed to parse files");
        console.log(file);
        res.json({});
    });
});