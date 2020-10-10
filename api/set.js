const Status = require("../utils/db");
const validate = require("../utils/validate");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
    if (!validate(req.body)) return res.status(400).json({err: "badRequest"});
    if (req.headers.authorization !== process.env.SECRET) return res.status(401).json({err: "badAuthorization"});

    res.json(await Status.create({
        id: uuid(),
        user: req.params.id,
        content: req.body.content,
        icon: req.body.icon,
        date: new Date(),
        end: new Date().getTime() + 1000 * req.body.time
    }));
};