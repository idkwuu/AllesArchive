require("dotenv").config();
const { PULSAR_SECRET, STATUS_SECRET } = process.env;

const axios = require("axios");

// Express
const app = require("express")();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
app.listen(8081, () => console.log("Server is online!"));

// Auth
app.use((req, res, next) => {
  if (req.headers["x-pulsar-token"] === PULSAR_SECRET) next();
  else res.status(401).json({ err: "badAuthorization" });
});

// Query
app.post("/query", (req, res) =>
  res.json({
    items: [1, 6, 12, 24].map((h) => ({
      text: `Set as status for ${h}h`,
      data: JSON.stringify({
        text: req.body.query,
        time: h * 60 * 60,
      }),
    })),
  })
);

// Response
app.post("/response", (req, res) => {
  res.json({});

  try {
    const { user, data } = req.body;
    const { text, time } = JSON.parse(data);

    axios
      .post(
        `https://wassup.alles.cc/${encodeURIComponent(user)}`,
        {
          content: text,
          time,
        },
        {
          headers: {
            Authorization: STATUS_SECRET,
          },
        }
      )
      .catch(() => {});
  } catch (err) {}
});
