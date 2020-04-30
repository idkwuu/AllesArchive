const credentials = require("./credentials");
const {SERVERNAME, DATASTORE, DATASTORETEMP} = process.env;
const fs = require("fs");
const fileType = require("file-type");
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
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    updatedAt: false
});
File.belongsTo(Client);

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
    if (!file.public && !req.client) return next();

    // Check if file is stored on server
    if (fs.existsSync(`${DATASTORE}/${file.id}`)) {
        // Serve File
        const fileData = fs.readFileSync(`${DATASTORE}/${file.id}`);
        res.type(file.type ? file.type : "text/plain").send(fileData);
    } else {
        next();
    }
});

// Upload File
app.post("/", (req, res) => {
    if (!req.Client) return res.status(401).send("Unauthorized");
    const form = formidable({
        uploadDir: DATASTORETEMP
    });

    form.parse(req, async (err, fields, {file}) => {
        if (err) return res.status(400).send("Failed to parse files");
        if (typeof fields.public !== "string") return res.status(400).send("No 'public' field");

        // Add File to Database
        const type = await fileType.fromFile(file.path);
        const f = await File.create({
            id: randomString({
                length: 128,
                capitalization: "lowercase"
            }),
            primaryServer: SERVERNAME,
            type: type ? type.mime : null,
            public: fields.public === "true" ? true : false
        });
        await f.setClient(req.Client);

        // Move File
        fs.renameSync(file.path, `${DATASTORE}/${f.id}`);

        // Return ID
        res.send(f.id);
    });
});