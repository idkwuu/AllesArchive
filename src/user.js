import axios from "axios";
import cookies from "js-cookie";

export const getUser = async () => {
  const id = (
    await axios.post("https://sessions.alles.cc", {
      token: cookies.get("sessionToken"),
    })
  ).data.user;
  const user = (await axios.get(`https://horizon.alles.cc/users/${id}`)).data;
  return user;
};
