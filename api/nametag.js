const db = require("../db");

module.exports = async (req, res) => {
	const {name, tag} = req.query;
	if (typeof name !== "string")
		return res.status(400).json({err: "badRequest"});

	if (typeof tag === "string") {
		// Get specific user
		const user = await db.User.findOne({
			where: {
				name,
				tag
			}
		});
		if (!user) return res.status(400).json({err: "missingResource"});
		res.json({
			id: user.id,
			name: user.name,
			tag: user.tag
		});
	} else {
		// Get list of users with name
		const users = await db.User.findAll({
			where: {
				name
			},
			order: ["tag"]
		});
		res.json(
			users.map(user => ({
				id: user.id,
				name: user.name,
				tag: user.tag
			}))
		);
	}
};
