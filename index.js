require("dotenv").config();
const {
    DB_HOST,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DATA_PATH,
    DATA_PATH_TEMP
} = process.env;

const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;
const fileType = require("file-type");

// Sequelize
const { Sequelize, DataTypes } = require("sequelize");
const db = new Sequelize(
	DB_NAME,
	DB_USERNAME,
	DB_PASSWORD,
	{
		host: DB_HOST,
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
        type: DataTypes.STRING
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
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING
    }
}, {
    updatedAt: false,
    paranoid: true
});
File.belongsTo(Client);

// Express
const express = require("express");
const app = express();
const formidable = require("formidable");
app.use((_err, _req, res, _next) => res.status(500).send("Internal Error"));
app.get("/", (_req, res) => res.sendFile(path.resolve("index.html")));
db.sync().then(() => app.listen(8080, () => console.log("Server is online.")));

// Client Authorization
app.use(async (req, _res, next) => {
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
    if (!client || !client.secret || client.secret !== credentials.secret) return next();
    
    req.Client = client;
    next();
});

// Get File
app.get("/:id", async (req, res, next) => {
    // Get record from database
    const file = await File.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!file) return next();

    // Restrict Non-Public Files
    if (!file.public && !req.Client) return next();

    // CORS for Public Files
    if (file.public) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    // Serve File
    if (fs.existsSync(`${DATA_PATH}/${file.id}`)) {
        res.type(file.type ? file.type : "text/plain").sendFile(path.resolve(`${DATA_PATH}/${file.id}`));
    } else {
        await file.destroy();
        next();
    }
});

// Upload File
app.post("/", (req, res) => {
    if (!req.Client) return res.status(401).send("Unauthorized");
    const form = formidable({
        uploadDir: DATA_PATH_TEMP
    });

    form.parse(req, async (err, _fields, data) => {
        if (err || !data || !data.file) return res.status(400).send("Failed to parse files");

        // Add File to Database
        const type = await fileType.fromFile(data.file.path);
        const f = await File.create({
            id: uuid(),
            public: typeof req.query.private !== "string",
            type: type ? type.mime : null
        });
        await f.setClient(req.Client);

        // Move File
        fs.renameSync(data.file.path, `${DATA_PATH}/${f.id}`);

        // Return ID
        res.send(f.id);
    });
});

// Delete File
app.delete("/:id", async (req, res, next) => {
    if (!req.Client) return res.status(401).send("Unauthorized");

    // Get record from database
    const file = await File.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!file) return next();

    // Serve File
    if (fs.existsSync(`${DATA_PATH}/${file.id}`)) fs.unlinkSync(`${DATA_PATH}/${file.id}`);
    await file.destroy();
    res.send("Successfully deleted");
});

// 404 Page
app.use((_req, res) => res.status(404).send("Not Found"));