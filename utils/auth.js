const axios = require("axios");

module.exports = async token => {
    try {
        return (
            await axios.post(
                `${process.env.NEXUS_URI}/sessions/token`,
                {token},
                {
                    auth: {
                        username: process.env.NEXUS_ID,
                        password: process.env.NEXUS_SECRET
                    }
                }
            )
        ).data.user;
    } catch (err) {}
};