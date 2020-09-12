const axios = require("axios");

module.exports = async (user, plus) =>
  axios.post(
    `${process.env.NEXUS_URI}/users/${user}`,
    { plus },
    {
      auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET
      }
    }
  );
