const db = require("../../db");
const getLevel = require("../../util/level");

module.exports = async (req, res) => {
	// Get User
	const user = await db.User.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!user) return res.status(404).json({err: "missingResource"});

	// Level
	const level = getLevel(user.xp);

	// Response
	res.json({
		id: user.id,
		name: user.name,
		tag: user.tag,
		nickname: user.nickname,
		plus: user.plus,
		createdAt: user.createdAt,
		xp: {
			total: user.xp,
			level: level.level,
			levelXp: level.remainingXp,
			levelXpMax: level.levelMaxXp,
			levelProgress: level.remainingXp / level.levelMaxXp
		},
		email: user.email,
		hasPassword: !!user.password,
		stripeCustomerId: user.stripeCustomerId,
		country: user.country,
		birth: {
			day: user.bDay,
			month: user.bMonth,
			year: user.bYear,
			date:
				user.bDay && user.bMonth && user.bYear
					? new Date(`${user.bYear}-${user.bMonth}-${user.bDay}`)
					: null
		}
	});
};
