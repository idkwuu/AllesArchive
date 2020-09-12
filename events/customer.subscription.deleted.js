const stripe = require("stripe")(process.env.STRIPE_SECRET);
const setPlus = require("../actions/setPlus");

module.exports = async event => {
  const { customer: customerId, plan } = event.data.object;
  const customer = await stripe.customers.retrieve(customerId);
  const { userId } = customer.metadata;

  // Alles+
  if (process.env.PLUS === plan.product) await setPlus(userId, false);
};
