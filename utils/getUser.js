const axios = require("axios");

module.exports = async user => {
  try {
    return (await axios.get(`${process.env.NEXUS_URI}/users/${user}`, {
      auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET
      }
    })).data;
  } catch (e) {
    return null;
  }
};
