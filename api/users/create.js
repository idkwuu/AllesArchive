const db = require("../../db");
const uuid = require("uuid").v4;
const argon2 = require("argon2");

module.exports = async (req, res) => {
	if (
		typeof req.body.name !== "string" ||
		typeof req.body.nickname !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	// Password
	let password = null;
	if (typeof req.body.password === "string") {
		try {
			password = await argon2.hash(req.body.password);
		} catch (err) {
			return res.status(500).json({err: "internalError"});
		}
	}

	// Create User
	const user = await db.User.create({
		id: uuid(),
		name: req.body.name,
		nickname: req.body.nickname,
		tag: "0001",
		password
	});

	// Response
	res.json({id: user.id});
};
