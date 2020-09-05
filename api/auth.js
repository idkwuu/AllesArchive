const quickauth = require("@alleshq/quickauth");
const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
    const {token} = req.query;
    if (typeof token !== "string") return res.status(400).send("No token provided");

    quickauth(token, process.env.QUICKAUTH_CALLBACK)
        .then(id => {
            const token = jwt.sign({user: id}, process.env.SESSION_SECRET, {expiresIn: "1 day"});
            res.cookie("token", token);
            res.redirect("/");
        })
        .catch(() => res.status(401).send("Invalid token"));
};