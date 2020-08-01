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

	// Get user id from nametag
	let id: String;
	try {
		id = (
			await axios.get(
				`https://nexus.alles.cc/nametag?name=${encodeURIComponent(
					req.body.name
				)}&tag=${encodeURIComponent(req.body.tag)}`,
				{
					auth: {
						username: process.env.NEXUS_ID,
						password: process.env.NEXUS_SECRET,
					},
				}
			)
		).data.id;
	} catch (err) {
		return res.status(400).json({ err: "user.signIn.credentials" });
	}
	console.log(id);
};
