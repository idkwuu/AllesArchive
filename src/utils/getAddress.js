export default req => {
	if (req.headers["x-forwarded-for"]) {
		const ips = req.headers["x-forwarded-for"].split(", ");
		return ips[ips.length - 1];
	} else return req.connection.remoteAddress;
};