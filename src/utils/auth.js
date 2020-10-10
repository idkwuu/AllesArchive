import axios from "axios";
const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env;

export default async (req) => {
  if (!req.headers.authorization) return;

  try {
    // Get session from token
    const session = (
      await axios.post(
        `${NEXUS_URI}/sessions/token`,
        {
          token: req.headers.authorization,
        },
        {
          auth: {
            username: NEXUS_ID,
            password: NEXUS_SECRET,
          },
        }
      )
    ).data;

    // Get user by id
    const user = (
      await axios.get(`${NEXUS_URI}/users/${session.user}`, {
        auth: {
          username: NEXUS_ID,
          password: NEXUS_SECRET,
        },
      })
    ).data;

    // Return data
    return user;
  } catch (err) {}
};
