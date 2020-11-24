const axios = require("axios");

export default async (req, res) => {
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

const rr = ["rick astley", "never gonna give you up", "rickroll", "rick roll"];
const isRickRoll = text => {
    for (let i = 0; i < rr.length; i++) {
        if (text.toLowerCase().includes(rr[i])) return true;
    }
    return false;
};