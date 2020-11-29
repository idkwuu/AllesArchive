import auth from "../../utils/auth";
import config from "../../config";
import axios from "axios";

const { NEXUS_URI, NEXUS_ID, NEXUS_SECRET } = process.env;

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body) return res.status(400).json({ err: "badRequest" });
	if (typeof req.body.option !== "string")
		return res.status(400).json({ err: "badRequest" });

	const option = config.plusOptions[req.body.option];
	if (!option) return res.status(400).json({ err: "badRequest" });

	console.log(option);
	res.json({});
};
