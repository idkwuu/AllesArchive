import { v4 as uuid } from "uuid";
import fs from "fs";

export default (req, res) => {
	const ua = req.headers["user-agent"];
	if (typeof ua === "string" && ua.startsWith("curl/")) return res.send(uuid());

	const page = fs.readFileSync(`${__dirname}/../page.html`, "utf-8");
	res.send(page.replace("[x]", uuid()));
};
