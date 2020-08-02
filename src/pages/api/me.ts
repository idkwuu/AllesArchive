import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Session, User } from "../../types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!req.cookies.sessionToken) {
		return res.status(401).send({ err: "badAuthorization" });
	}

	const token = req.cookies.sessionToken;
	const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env;
	const auth = { username: NEXUS_ID, password: NEXUS_SECRET };

	try {
		// Get session from token
		const session: Omit<Session, "token"> = await axios
			.post(`${NEXUS_URI}/sessions/token`, { token }, { auth })
			.then(res => res.data);

		// Get user by id
		const user: User = await axios
			.get(`${NEXUS_URI}/users/${session.user}`, { auth })
			.then(res => res.data);

		res.send(user);
	} catch (error) {
		console.log(error);
		res.send({});
	}
};
