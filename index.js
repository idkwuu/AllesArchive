require("dotenv").config();

// HTTP Server
const app = require("express")();
app.use(require("body-parser").raw({ type: "application/json" }));
app.listen(process.env.PORT || 8080);

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Events
const eventCodes = ["charge.succeeded"];
const events = {};
eventCodes.forEach((code) => (events[code] = require(`./events/${code}`)));

// Webhook
app.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (events[event.type]) await events[event.type](event);
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Internal Error");
  }
});
