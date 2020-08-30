const db = require("../../db");
const log = require("../../util/log");
const values = {
  name: "string",
  tag: "string",
  nickname: "string",
  plus: "boolean",
  email: "string",
  stripeCustomerId: "string",
  country: "string",
  bDay: "number",
  bMonth: "number",
  bYear: "number",
};

module.exports = async (req, res) => {
  // Check updates
  for (let i = 0; i < Object.keys(req.body).length; i++) {
    if (
      typeof req.body[Object.keys(req.body)[i]] !==
      values[Object.keys(req.body)[i]]
    )
      return res.status(400).json({ err: "badRequest" });
  }

  // Get User
  const user = await db.User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ err: "missingResource" });

  // Update
  await user.update(req.body);

  // Response
  res.json({});

  // Log params
  const logParams = {};
  Object.keys(req.body).forEach(
    (key) =>
      (logParams[key] =
        typeof req.body[key] === "string"
          ? req.body[key]
          : JSON.stringify(req.body[key]))
  );

  // Log
  log("user.update", logParams, req.client.id, user.id);
};
