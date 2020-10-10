const Status = require("./db");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
    if (req.headers.authorization !== process.env.SECRET) return res.status(401).json({err: "badAuthorization"});
    const {content, icon, time} = req.body;
    if (typeof time !== "number") return res.status(400).json({err: "badRequest"});

    res.json(await Status.create({
        id: uuid(),
        user: req.params.id,
        content,
        icon,
        date: new Date(),
        end: new Date().getTime() + 1000 * time
    }));
};