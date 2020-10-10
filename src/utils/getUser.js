import axios from "axios";
const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env;

export default async (id) => {
  try {
    return (
      await axios.get(`${NEXUS_URI}/users/${encodeURIComponent(id)}`, {
        auth: {
          username: NEXUS_ID,
          password: NEXUS_SECRET,
        },
      })
    ).data;
  } catch (err) {}
};
