import auth from "../../utils/auth";

export default async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	res.json({
		id: user.id,
		name: user.name,
		nickname: user.nickname,
		tag: user.tag,
		plus: user.plus,
	});
};
