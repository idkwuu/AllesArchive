import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types";

type Credentials = {
	nametag: string;
	password: string;
};

export default async (
	{ method, body }: NextApiRequest,
	res: NextApiResponse
) => {
	if (method !== "POST") {
		return res.status(405).send({ err: "methodNotAllowed" });
	}

	if (!body || !body.nametag || !body.password) {
		return res.status(400).send({ err: "badRequest" });
	}

	const { NEXUS_CLIENT_ID, NEXUS_CLIENT_SECRET } = process.env;
	const auth = Buffer.from(`${NEXUS_CLIENT_ID}:${NEXUS_CLIENT_SECRET}`);
	const nametag = body.nametag.split("#");

	// 1. Convert nametag to id
	const {
		id,
	}: Pick<
		User,
		"id" | "name" | "tag"
	> = await fetch(
		`https://nexus.alles.cc/nametag?name=${nametag[0]}&tag=${nametag[1]}`,
		{ headers: [["Authorization", `Basic ${auth.toString("base64")}`]] }
	).then(res => res.json());

	// 2. Verify Password

	// 3. Create Session

	return res.send(id);
};
