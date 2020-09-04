const jwt = require("jsonwebtoken");
const getUser = require("./getUser");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (typeof token !== "string") return res.status(401).send("Bad Authorization");

    try {
        const {user: id} = await jwt.verify(token, process.env.SESSION_SECRET);
        req.user = await getUser(id);
        next();
    } catch (err) {
        return res.status(401).send("Bad Authorization");
    }
};