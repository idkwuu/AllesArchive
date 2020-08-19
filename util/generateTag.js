const db = require("../db");

const generateTag = async (name) => {
  const tag = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  if (tag === "0000") return await generateTag(name);

  const alreadyExists = !!(await db.User.findOne({
    where: {
      name,
      tag,
    },
  }));
  if (alreadyExists) return await generateTag(name);

  return tag;
};

module.exports = generateTag;
