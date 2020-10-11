import axios from "axios";

export default async (req, res) => {
  if (typeof req.query.username !== "string")
    return res.status(400).json({ err: "badRequest" });

  try {
    res.json({
      id: (
        await axios.get(
          `${process.env.NEXUS_URI}/username/${encodeURIComponent(
            req.query.username
          )}`,
          {
            auth: {
              username: process.env.NEXUS_ID,
              password: process.env.NEXUS_SECRET,
            },
          }
        )
      ).data.id,
    });
  } catch (err) {
    res.json({ err: "missingResource" });
  }
};
