const axios = require("axios");

module.exports = async (userId, active) => {
  axios.post(
    `${process.env.NEXUS_URI}/users/${userId}`,
    { plus: active },
    {
      auth: {
        username: process.env.ALLES_ID,
        password: process.env.ALLES_SECRET
      }
    }
  );
};
