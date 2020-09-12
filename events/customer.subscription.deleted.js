const setPlus = require("../actions/setPlus");

module.exports = async event => {
  const { customer, plan } = event.data.object;
  const { product } = plan;

  // Alles+
  if (
    process.env.PLUS_MONTHLY === product ||
    process.env.PLUS_YEARLY === product
  )
    await setPlus(customer, false);
};
