module.exports = (req, res, next) => {
	// Auth Header
	if (
		typeof req.headers.authorization !== "string" ||
		!req.headers.authorization.startsWith("Basic ") ||
		req.headers.authorization.split(" ").length !== 2
	)
		return res.status(401).json({err: "badAuthorization"});

	// Parse credentials
	const encoded = req.headers.authorization.split(" ")[1];
	let credentials;
	try {
		credentials = Buffer.from(encoded, "base64").toString().split(":");
	} catch (err) {
		return res.status(401).json({err: "badAuthorization"});
	}
	if (credentials.length !== 2)
        return res.status(401).json({err: "badAuthorization"});
    console.log(credentials);

	// Continue
	next();
};
