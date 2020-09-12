const stripe = require("stripe")(process.env.STRIPE_SECRET);
const setPlus = require("../actions/setPlus");
const plusEmail = require("../actions/plusEmail");

module.exports = async event => {
  const { customer: customerId, plan } = event.data.object;
  const { product } = plan;
  const customer = await stripe.customers.retrieve(customerId);
  const { userId } = customer.metadata;

  // Alles+
  console.log(plan);
  console.log(product);
  if (
    process.env.PLUS_MONTHLY === product ||
    process.env.PLUS_YEARLY === product
  ) {
    await setPlus(userId, true);
    await plusEmail(userId, customer.email);
  }
};
