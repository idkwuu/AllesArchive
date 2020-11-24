const axios = require("axios");

// API Handler
const api = async (req, res) => {
    if (typeof req.query.url !== "string") return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    try {
        const {data} = await axios.get(req.query.url, {
            transformRespond: undefined
        });
        res.json({rickroll: isRickRoll(data)});
    } catch (err) {
        res.json({rickroll: false});
    }
};

// Test for Rickroll
const rr = ["rick astley", "never gonna give you up", "rickroll", "rick roll"];
const isRickRoll = text => {
    for (let i = 0; i < rr.length; i++) {
        if (text.toLowerCase().includes(rr[i])) return true;
    }
    return false;
};

// Enable CORS
const allowCors = fn => async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") return res.status(200).end();
    return await fn(req, res);
}

// Export
export default allowCors(api);