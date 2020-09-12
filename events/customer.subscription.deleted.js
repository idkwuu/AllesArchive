const stripe = require("stripe")(process.env.STRIPE_SECRET);
const setPlus = require("../actions/setPlus");

module.exports = async event => {
  const { customer, plan } = event.data.object;
  const { product } = plan;
  const userId = (await stripe.customers.retrieve(customer)).metadata.userId;

  // Alles+
  if (
    process.env.PLUS_MONTHLY === product ||
    process.env.PLUS_YEARLY === product
  )
    await setPlus(userId, false);
};
