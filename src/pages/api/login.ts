import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (
		!req.body ||
		typeof req.body.name !== "string" ||
		typeof req.body.tag !== "string" ||
		typeof req.body.password !== "string"
	)
		return res.status(400).send({ err: "badRequest" });

	const { NEXUS_ID, NEXUS_SECRET } = process.env;
	const name = encodeURIComponent(req.body.name);
	const tag = encodeURIComponent(req.body.tag);

	// Get user id from nametag
	try {
		const { id } = await axios
			.get(`https://nexus.alles.cc/nametag?name=${name}&tag=${tag}`, {
				auth: { username: NEXUS_ID, password: NEXUS_SECRET },
			})
			.then(res => res.data);

		console.log(id);
	} catch (err) {
		return res.status(400).json({ err: "user.signIn.credentials" });
	}
};
