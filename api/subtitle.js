const subtitles = require("../subtitles");

module.exports = async (req, res) => {
    res.send(
        (
            req.user.id === "c1d1fe95-cac7-4d92-8cd8-8f30d6ac5ca8" &&
            Math.floor(Math.random() * 2) === 0
        ) ?
            "#BringBackBdrian" :
            Math.floor(Math.random() * 5) === 0 ?
                "#BlackLivesMatter" :
                subtitles[Math.floor(Math.random() * subtitles.length)]
    );
};