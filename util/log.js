const db = require("../db");
const uuid = require("uuid").v4;

module.exports = async (name, params, clientId, userId) => {
  try {
    const event = await db.Event.create({
      id: uuid(),
      name,
      clientId,
      userId,
    });

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
  } catch (err) {}
};
