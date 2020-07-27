const db = require("../../db");

module.exports = async (req, res) => {
	// Get Session
	const session = await db.Session.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!session) return res.status(404).json({err: "missingResource"});

	// Response
	res.json({
		id: session.id,
		user: session.userId,
		address: session.address,
		createdAt: session.createdAt
	});
};
