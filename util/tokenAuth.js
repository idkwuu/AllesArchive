const axios = require("axios");
const db = require("./mongo");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (typeof token !== "string") return res.status(400).json({err: "noAuthToken"});

    const oauthFail = () => res.status(401).json({err: "oauthFailed"});

    // Get Token
    oauth("token", token).then(response => {
        const tokenData = response.data;
        if (
            !tokenData.scopes.includes("basic-profile") ||
            !tokenData.scopes.includes("team-list")
        ) return oauthFail();
        
        // Get data about user
        oauth("me", token).then(async response => {
            req.user = response.data;

            var playerData = await db("players").findOne({_id: req.user.id});
            if (!playerData) {
                playerData = {
                    _id: req.user.id,
                    plays: 0,
                    kills: 0,
                    donor: false,
                    effects: []
                };
                await db("players").insertOne(playerData);
            }
            req.user.data = playerData;

            next();
        }).catch(oauthFail);
    }).catch(oauthFail);
};

const oauth = (endpoint, token) => {
    return axios.get(`https://api.alles.cx/v1/${endpoint}`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    });
};