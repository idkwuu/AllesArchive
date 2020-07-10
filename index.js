// Express
const express = require("express");
const app = express();
app.use(require("body-parser").json());
app.use((err, req, res, next) => res.status(500).json({err: "internalError"}));
app.listen(8080, () => console.log("Express is listening..."));

// 404
app.use((req, res) => res.status(404).json({err: "notFound"}));
