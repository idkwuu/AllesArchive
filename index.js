const fs = require("fs");
const express = require("express");
const app = express();
app.listen(8080);

app.post("/", (req, res) => {
    try {
        if (req.headers.authorization !== process.env.SECRET) return res.status(401).send("Unauthorized");

        let data = "";
        req.on("data", chunk => data += chunk);

        req.on("end", () => {
            fs.writeFileSync(`${process.env.DATA}/${new Date().getTime()}`, Buffer.from(data, "base64").toString("binary"));
            res.status(200).send("Success");
        });
    } catch (e) {
        res.status(500).send("Internal Error");
    }
});