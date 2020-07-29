const axios = require("axios");
const renderCard = require("../renderCard.js");
const errorCard = require("../errorCard.js");

module.exports = (req, res) => {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(req.query.id)}`)
        .then(({data}) => res.send(renderCard(data)))
        .catch(() => res.status(404).send(errorCard));
}