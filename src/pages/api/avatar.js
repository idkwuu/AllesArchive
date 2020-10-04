import auth from "../../utils/auth";
import config from "../../config";
import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";

const api = async (req, res) => {
	const user = await auth(req);
	if (!user) return res.status(401).send({ err: "badAuthorization" });

	if (!req.body || typeof req.body.image !== "string")
		return res.status(400).json({ err: "badRequest" });

	// Upload Image
	try {
		// Convert to Buffer
		let img = Buffer.from(req.body.image.split(";base64,")[1], "base64");

		// Resize
		img = await sharp(img)
			.resize({
				width: 500,
				height: 500,
				fit: "cover",
			})
			.flatten({
				background: {
					r: 255,
					g: 255,
					b: 255,
				},
			})
			.png()
			.toBuffer();

		// Upload to WalnutFS
		const formData = new FormData();
		formData.append("file", img, { filename: "image" });
		const file = (
			await axios.post(process.env.WALNUTFS_URI, formData.getBuffer(), {
				auth: {
					username: process.env.WALNUTFS_ID,
					password: process.env.WALNUTFS_SECRET,
				},
				headers: formData.getHeaders(),
			})
		).data;

		// Set avatar
		await axios.post(
			`${process.env.AVATAR_URI}/${user.id}`,
			{
				source: file,
			},
			{
				headers: {
					Authorization: process.env.AVATAR_SECRET,
				},
			}
		);

		// Response
		res.json({});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ err: "internalError" });
	}
};

// API Config
const conf = {
	api: {
		bodyParser: {
			sizeLimit: config.avatarSize,
		},
	},
};

// Exports
export { api as default, conf as config };
