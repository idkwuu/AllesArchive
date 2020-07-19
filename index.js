// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use(require("./auth"));
app.use((err, req, res, next) => res.status(500).json({err: "internalError"}));

// Database
const db = require("./db");
db.sync().then(() =>
	app.listen(8080, () => console.log("Server is listening..."))
);

// 404
app.use((req, res) => res.status(404).json({err: "notFound"}));
