const axios = require("axios");

module.exports = async (user, plus) =>
  axios.post(
    `${process.env.NEXUS_URI}/users/${user}`,
    { plus },
    {
      auth: {
        username: process.env.ALLES_ID,
        password: process.env.ALLES_SECRET
      }
    }
  );
