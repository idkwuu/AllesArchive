const stripe = require("stripe")(process.env.STRIPE_SECRET);
const setPlus = require("../actions/setPlus");
const plusEmail = require("../actions/plusEmail");

module.exports = async event => {
  const { customer: customerId, plan } = event.data.object;
  const customer = await stripe.customers.retrieve(customerId);
  const { userId } = customer.metadata;

  // Alles+
  if (process.env.PLUS === plan.product) {
    await setPlus(userId, true);
    await plusEmail(userId, customer.email);
  }
};
