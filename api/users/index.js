const db = require("../../db");

module.exports = async (req, res) => {
	// Get User
	const user = await db.User.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!user) return res.status(404).json({err: "missingResource"});

	// Response
	res.json({
		id: user.id,
		name: user.name,
		tag: user.tag,
		nickname: user.nickname,
		plus: user.plus,
		createdAt: user.createdAt,
		reputation: user.reputation,
		hasPassword: !!user.password,
		stripeCustomerId: user.stripeCustomerId,
		country: user.country,
		bDay: user.bDay,
		bMonth: user.bMonth,
		bYear: user.bYear,
		birthday:
			user.bDay && user.bMonth && user.bYear
				? new Date(`${user.bYear}-${user.bMonth}-${user.bDay}`)
				: null
	});
};
