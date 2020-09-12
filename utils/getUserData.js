const axios = require("axios");

module.exports = async userId => {
  try {
    return (await axios.get(
      `https://1api.alles.cx/v1/user?id=${encodeURIComponent(userId)}`,
      {
        auth: {
          username: process.env.ALLES_ID,
          password: process.env.ALLES_SECRET
        }
      }
    )).data;
  } catch (e) {
    return null;
  }
};
