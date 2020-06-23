const stripeIds = require("../stripeIds");
const setPlus = require("../actions/setPlus");

module.exports = (body, res) => {
	const {customer, plan} = body.data.object;
	const {product} = plan;

	// Alles+
	if (stripeIds.plus.includes(product)) setPlus(customer, false, true);
	// Alles+ Max
	else if (stripeIds.plusMax.includes(product)) setPlus(customer, true, true);
};
