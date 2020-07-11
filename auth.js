const db = require("./db");

module.exports = async (req, res, next) => {
	// Auth Header
	if (
		typeof req.headers.authorization !== "string" ||
		!req.headers.authorization.startsWith("Basic ") ||
		req.headers.authorization.split(" ").length !== 2
	)
		return res.status(401).json({err: "badAuthorization"});

	// Parse Credentials
	const encoded = req.headers.authorization.split(" ")[1];
	let credentials;
	try {
		credentials = Buffer.from(encoded, "base64").toString().split(":");
	} catch (err) {
		return res.status(401).json({err: "badAuthorization"});
	}
	if (credentials.length !== 2)
		return res.status(401).json({err: "badAuthorization"});

	// Get Client
	const client = await db.NexusClient.findOne({
		where: {
			id: credentials[0]
		}
	});
	if (!client || client.secret !== credentials[1])
		return res.status(401).json({err: "badAuthorization"});

	// Continue
	next();
};
