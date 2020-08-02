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

	const name = encodeURIComponent(req.body.name);
	const tag = encodeURIComponent(req.body.tag);
	const password = req.body.password;

	const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env;
	const auth = { username: NEXUS_ID, password: NEXUS_SECRET };

	try {
		// Get user id from nametag
		const {
			id,
		}: {
			id: string;
		} = await axios
			.get(`${NEXUS_URI}/nametag?name=${name}&tag=${tag}`, { auth })
			.then(res => res.data);

		// Validate password
		const { matches } = await axios
			.post(`${NEXUS_URI}/users/${id}/password/verify`, { password }, { auth })
			.then(res => res.data);

		if (!matches) throw Error();

		// Create session
		const user = id;
		const address = getAddress(req);

		const { token } = await axios
			.post(`${NEXUS_URI}/sessions`, { user, address }, { auth })
			.then(res => res.data);

		res.json({ token });
	} catch (error) {
		return res.status(400).json({ err: "user.signIn.credentials" });
	}
};
