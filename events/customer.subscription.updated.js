const stripeIds = require("../stripeIds");
const setPlus = require("../actions/setPlus");

module.exports = async body => {
	const {customer, plan} = body.data.object;
    const {product} = plan;
    
    return console.log(stripeIds.plus.includes(product));

	// Alles+
	if (stripeIds.plus.includes(product)) await setPlus(customer, false, true);
	// Alles+ Max
	else if (stripeIds.plusMax.includes(product))
		await setPlus(customer, true, true);
};
