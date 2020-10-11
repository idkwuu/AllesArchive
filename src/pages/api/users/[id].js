import getUser from "../../../utils/getUser";
import axios from "axios";

export default async (req, res) => {
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const u = await getUser(req.query.id);
  if (!u) return res.status(404).json({ err: "missingResource" });

  // Micro
  let micro;
  try {
    const data = (
      await axios.get(
        `https://micro.alles.cx/api/users/${encodeURIComponent(u.id)}`
      )
    ).data;
    micro = {
      posts: data.posts.count,
      followers: data.followers.count,
    };
  } catch (err) {}

  // Response
  res.json({
    id: u.id,
    name: u.name,
    tag: u.tag,
    plus: u.plus,
    nickname: u.nickname,
    createdAt: u.createdAt,
    xp: u.xp,
    country: u.country,
    micro,
  });
};
