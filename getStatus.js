const Status = require("./db");

module.exports = async (req, res) => {
    const status = (
        await Status.findAll({
            where: {
                user: req.params.id
            },
            order: [["date", "DESC"]],
            limit: 1
        })
    )[0];
    
    res.json({
        status: status && status.content && status.end > new Date() ? status : null
    });
};