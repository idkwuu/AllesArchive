const stripeIds = require("../stripeIds");
const setPlus = require("../actions/setPlus");

module.exports = async event => {
  const { customer, plan, ended_at } = event.data.object;
  const { product } = plan;

  // Alles+
  if (stripeIds.plus.includes(product)) {
    await setPlus(customer, true, false);
    if (!ended_at) await setPlus(customer, false, true);
  }
  // Alles+ Max
  else if (stripeIds.plusMax.includes(product)) {
    if (!ended_at) await setPlus(customer, true, true);
  }
};
