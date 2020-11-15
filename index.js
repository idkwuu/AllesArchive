require("dotenv").config();

// Express
const app = require("express")();
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) =>
  res.status(500).json({ err: "internalError" })
);
app.listen(8081, () => console.log("Server is online!"));

// Auth
app.use((req, res, next) => {
  if (req.headers["x-pulsar-token"] === process.env.PULSAR_SECRET) next();
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
