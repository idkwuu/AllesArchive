// HTTP Server
const app = require("express")();
app.use(require("body-parser").json());

// Webhook
app.post("/", (req, res) => {
    console.log(req.body);
    res.status(200).send("success");
});