import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getAddress from "../../utils/getAddress";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (
		!req.body ||
		typeof req.body.name !== "string" ||
		typeof req.body.tag !== "string" ||
		typeof req.body.password !== "string"
	)
		return res.status(400).send({ err: "badRequest" });

	// Get user id from nametag
	let id: string;
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

	// Validate password
	try {
		if (
			!(
				await axios.post(
					`https://nexus.alles.cc/users/${id}/password/verify`,
					{
						password: req.body.password,
					},
					{
						auth: {
							username: process.env.NEXUS_ID,
							password: process.env.NEXUS_SECRET,
						},
					}
				)
			).data.matches
		)
			return res.status(400).json({ err: "user.signIn.credentials" });
	} catch (err) {
		return res.status(400).json({ err: "user.signIn.credentials" });
	}

	// Create session
	let token: string;
	try {
		token = (
			await axios.post(
				`https://nexus.alles.cc/sessions`,
				{
					user: id,
					address: getAddress(req),
				},
				{
					auth: {
						username: process.env.NEXUS_ID,
						password: process.env.NEXUS_SECRET,
					},
				}
			)
		).data.token;
	} catch (err) {
		return res.status(500).json({ err: "internalError" });
	}

	// Response
	res.json({ token });
};
