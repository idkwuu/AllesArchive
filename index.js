// Express
const express = require("express");
const app = express();
app.listen(8080, () => console.log("Server is online!"));

// Nexus
const nexus = require("@alleshq/nexus");
nexus.setCredentials(process.env.NEXUS_ID, process.env.NEXUS_SECRET);

// Get User ID from Name#tag
app.get("/nametag", (req, res) => {
    if (typeof req.query.name !== "string" || typeof req.query.tag !== "string")
        return res.status(400).json({err: "badRequest"});
    
    nexus.nametag(req.query.name, req.query.tag)
        .then(({id}) => res.json({id}))
        .catch(() => res.status(400).json({err: "missingResource"}));
});

// 404
app.use((req, res) => res.status(404).json({err: "notFound"}));