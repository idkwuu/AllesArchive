const credentials = require("./credentials");
const {SERVERNAME, DATASTORE, DATASTORETEMP, PORT, DOMAIN, PRIMARYSERVER} = process.env;
const fs = require("fs");
const fileType = require("file-type");
const randomString = require("randomstring").generate;
const axios = require("axios");

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
    app.listen(PORT, () =>
        console.log("Server is online.")
    )
);

// Homepage
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
    if (!file.public && !req.Client) return next();

    // CORS for Public Files
    if (file.public) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    // Check if file is stored on server
    if (fs.existsSync(`${DATASTORE}/${file.id}`)) {
        // Serve File
        const fileData = fs.readFileSync(`${DATASTORE}/${file.id}`);
        res.type(file.type ? file.type : "text/plain").send(fileData);
    } else {
        if (SERVERNAME === file.primaryServer) {
            // Primary Server does not have file - file is gone
            await file.destroy();
            next();
        } else {
            // Get File from Primary Server
            const url = `${PRIMARYSERVER ? PRIMARYSERVER : `https://${file.primaryServer}.${DOMAIN}`}/${file.id}`;
            axios.get(url, {
                headers: {
                    authorization: req.headers.authorization ? req.headers.authorization : ""
                },
                responseType: "arraybuffer"
            }).then(serverRequest => {
                // Save locally and respond
                res.type(serverRequest.headers["content-type"]).send(serverRequest.data);
                fs.writeFileSync(`${DATASTORE}/${file.id}`, serverRequest.data);
            }).catch(() => {
                // Failed to get from primary server
                next();
            });
        }
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

// 404 Page
const notFoundPage = fs.readFileSync(`${__dirname}/404.html`, "utf8")
    .replace(/SERVERNAME/g, SERVERNAME);
app.use((req, res) => res.status(404).send(notFoundPage));