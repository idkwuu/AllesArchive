import auth from "../../utils/auth";
import axios from "axios";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Get Status
  let status;
  try {
    status = (
      await axios.get(`https://wassup.alles.cc/${encodeURIComponent(user.id)}`)
    ).data.status;
  } catch (err) {}

  // Response
  res.json({
    id: user.id,
    name: user.name,
    nickname: user.nickname,
    username: user.username,
    tag: user.tag,
    plus: user.plus,
    status,
  });
};
