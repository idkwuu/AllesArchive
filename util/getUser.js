const axios = require("axios");

module.exports = async id => (
    await axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(id)}`)
).data;