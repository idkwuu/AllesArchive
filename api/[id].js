const axios = require("axios");

module.exports = (req, res) =>
    axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(req.query.id)}`)
        .then(({data}) => {
            console.log(data);
            res.send("Something went right!");
        })
        .catch(() => {
            res.status(400).send("Something went wrong!");
        });