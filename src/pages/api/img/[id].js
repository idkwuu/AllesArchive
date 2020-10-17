import getUser from "../../../utils/getUser";
import capture from "capture-website";

export default async (req, res) => {
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const u = await getUser(req.query.id);
  if (!u) return res.status(404).json({ err: "missingResource" });

  // Capture Website
  try {
    const img = await capture.buffer(
      `${process.env.NEXT_PUBLIC_ORIGIN}/${u.id}`
    );
    res.setHeader("Content-Type", "image/png");
    res.send(img);
  } catch (err) {
    res.status(500).json({ err: "internalError" });
  }
};
