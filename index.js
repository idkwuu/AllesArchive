require("dotenv").config();
const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

const axios = require("axios");
const app = require("express")();
app.use(require("body-parser").json());
app.use(require("cors")());
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
app.listen(8080);

app.post("/", async (req, res) => {
  const { token } = req.body;

  if (typeof token !== "string")
    return res.status(400).json({ err: "badRequest" });

  try {
    res.json(
      (
        await axios.post(
          `${NEXUS_URI}/sessions/token`,
          { token },
          {
            auth: {
              username: NEXUS_ID,
              password: NEXUS_SECRET,
            },
          }
        )
      ).data
    );
  } catch (err) {
    res.status(400).json({ err: "session.badToken" });
  }
});
