import axios from "axios";
import cookies from "js-cookie";

export const getUser = async () => {
  const id = (
    await axios.post("https://sessions.alles.cc", {
      token: cookies.get("sessionToken"),
    })
  ).data.user;
  const user = (await axios.get(`https://horizon.alles.cc/users/${id}`)).data;

  let music;
  try {
    music = (await axios.get(`https://spotify.alles.cc/alles/${id}`)).data.item;
  } catch (err) {}

  return { ...user, music };
};
