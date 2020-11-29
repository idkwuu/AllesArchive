const axios = require("axios");

module.exports = async (method, endpoint, data) =>
  (
    await axios({
      method: method,
      url: `${process.env.NEXUS_URI}/${endpoint}`,
      data,
      auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET,
      },
    })
  ).data;
