const getUser = require("../utils/getUser");
const axios = require("axios");
const escapeHtml = require("escape-html");
const template = require("fs")
  .readFileSync(`${__dirname}/../plusEmail.html`, "utf8")
  .split("[x]");

module.exports = async (userId, email) => {
  const user = await getUser(userId);

  try {
    await axios.post(
      `${process.env.POSTAL_URI}/api/v1/send/message`,
      {
        to: [email],
        from: "plus@alles.cx",
        reply_to: "archie@alles.cx",
        subject: "Welcome to Alles+!",
        html_body: template[0] + escapeHtml(user.nickname) + template[1]
      },
      {
        headers: {
          "X-Server-API-Key": process.env.POSTAL_KEY
        }
      }
    );
  } catch (err) {}
};
