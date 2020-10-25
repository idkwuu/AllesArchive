const Status = require("../utils/db");
const validate = require("../utils/validate");
const auth = require("../utils/auth");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
    if (!validate(req.body)) return res.status(400).json({err: "badRequest"});
    const user = await auth(req.headers.authorization);
    if (!user) return res.status(401).json({err: "badAuthorization"});

    // Cooldown
    const status = (
        await Status.findAll({
            where: {user},
            order: [["date", "DESC"]],
            limit: 1
        })
    )[0];
    if (status && status.date.getTime() > new Date().getTime() - 1000 * 5)
        return res.status(429).json({err: "cooldown"});

    // Create Status
    res.json(await Status.create({
        id: uuid(),
        user,
        content: req.body.content,
        date: new Date(),
        end: new Date().getTime() + 1000 * req.body.time
    }));
};