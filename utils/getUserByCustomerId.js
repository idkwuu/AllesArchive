const axios = require("axios");

module.exports = async customerId => {
  try {
    return (await axios.get(
      `https://1api.alles.cx/v1/stripeCustomer?id=${encodeURIComponent(
        customerId
      )}`,
      {
        auth: {
          username: process.env.ALLES_ID,
          password: process.env.ALLES_SECRET
        }
      }
    )).data.id;
  } catch (e) {
    return null;
  }
};
