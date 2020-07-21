const db = require("../../db");
const config = require("../../config");
const uuid = require("uuid").v4;
const argon2 = require("argon2");

module.exports = async (req, res) => {
	if (
		typeof req.body.name !== "string" ||
		typeof req.body.nickname !== "string"
	)
		return res.status(400).json({err: "badRequest"});

	const name = req.body.name.trim();
	const nickname = req.body.nickname.trim();

	// Password
	let password = null;
	if (typeof req.body.password === "string") {
		try {
			password = await argon2.hash(req.body.password);
		} catch (err) {
			return res.status(500).json({err: "internalError"});
		}
	}

	// Count Names
	const nameCount = await db.User.count({
		where: {
			name
		}
	});
	if (nameCount >= config.nameLimit)
		return res.status(400).json({err: "profile.name.tooMany"});

	// Create User
	const user = await db.User.create({
		id: uuid(),
		name,
		nickname,
		tag: "0001",
		password
	});

	// Response
	res.json({id: user.id});
};
