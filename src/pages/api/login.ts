import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (
		!req.body ||
		typeof req.body.nametag !== "string" ||
		typeof req.body.password !== "string"
	)
		return res.status(400).send({ err: "badRequest" });

	const { NEXUS_ID, NEXUS_SECRET } = process.env;
	const auth = Buffer.from(`${NEXUS_ID}:${NEXUS_SECRET}`);
	const nametag = req.body.nametag.split("#");

	// Convert nametag to id
	const {
		id,
	}: Pick<
		User,
		"id" | "name" | "tag"
	> = await fetch(
		`https://nexus.alles.cc/nametag?name=${nametag[0]}&tag=${nametag[1]}`,
		{ headers: [["Authorization", `Basic ${auth.toString("base64")}`]] }
	).then(res => res.json());

	// Verify Password

	// Create Session
};
