const axios = require("axios");
const getUser = require("../utils/getUserByCustomerId");

module.exports = async (customer, active) => {
  const userId = await getUser(customer);

  axios.post(
    `https://1api.alles.cx/v1/plus?id=${encodeURIComponent(userId)}`,
    { plus: active },
    {
      auth: {
        username: process.env.ALLES_ID,
        password: process.env.ALLES_SECRET
      }
    }
  );
};
