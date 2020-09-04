const credentials = require("../credentials");
const axios = require("axios");

module.exports = (req, res) => {
    const {code} = req.body;
    if (typeof code !== "string") return res.status(400).json({err: "noAuthCode"});

    // OAuth Token Request
    axios.post("https://api.alles.cx/v1/token", {
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://shootydot.alles.cx/auth/cb"
    }, {
        auth: {
            username: credentials.allesOAuth.id,
            password: credentials.allesOAuth.secret
        }
    }).then(response => {
        res.json({
            token: response.data.access_token
        });
    }).catch(() => {
        res.status(401).json({err: "oauthFailed"});
    });
};