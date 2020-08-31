const db = require("../db");
const uuid = require("uuid").v4;

module.exports = async (name, params, clientId, userId) => {
  // Create Event
  const event = await db.Event.create({
    id: uuid(),
    name,
  });

  // Client Association
  const client = await db.Client.findOne({
    where: {
      id: clientId,
    },
  });
  await event.setClient(client);

  // User Association
  const user = await db.User.findOne({
    where: {
      id: userId,
    },
  });
  await event.setUser(user);

  // Create Parameters
  if (params)
    await Promise.all(
      Object.keys(params).map((key) =>
        db.EventParam.create({
          id: uuid(),
          key,
          value: params[key],
          eventId: event.id,
        })
      )
    );
};
