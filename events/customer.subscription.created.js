const stripeIds = require("../stripeIds");
const setPlus = require("../actions/setPlus");
const plusEmail = require("../actions/plusEmail");

module.exports = async event => {
  const { customer, plan } = event.data.object;
  const { product } = plan;

  // Alles+
  if (stripeIds.plus.includes(product)) {
    await setPlus(customer, true);
    await plusEmail(customer);
  }
};
