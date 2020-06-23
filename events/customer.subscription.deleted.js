const stripeIds = require("../stripeIds");
const setPlus = require("../actions/setPlus");

module.exports = async event => {
	const {customer, plan} = event.data.object;
	const {product} = plan;

	// Alles+
	if (stripeIds.plus.includes(product)) await setPlus(customer, false, false);
	// Alles+ Max
	else if (stripeIds.plusMax.includes(product))
		await setPlus(customer, true, false);
};
