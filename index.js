require("dotenv").config();
const axios = require("axios");

// Discord
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN).then(async () => {
    console.log("Bot is online");
    const server = bot.guilds.cache.first();
    const linkedRole = await server.roles.fetch(process.env.LINKED_ROLE);
    const plusRole = await server.roles.fetch(process.env.PLUS_ROLE);

    // On Message
    bot.on("message", async msg => {
        if (msg.content.startsWith(process.env.PREFIX) && msg.guild) {
            const cmdString = msg.content.substr(process.env.PREFIX.length).toLowerCase();
            const cmd = commands[cmdString.split(" ")[0]];
            if (cmd) await cmd(msg, cmdString);
            else await msg.channel.send(`Sorry, ${msg.author}, that command doesn't exist! Try ${process.env.PREFIX}help to see all the commands you can use :)`);
        }
    });

    // Members
    const memberList = async () => (await server.members.fetch())
        .forEach(async member => {
            let user;
            try {
                user = await getUserData(await getAllesId(member.user.id));
            } catch (err) { }

            // Set Name
            try {
                const nickname = user ? user.nickname.substr(0, 32) : null;
                if (member.nickname !== nickname && (member.user.username !== nickname || !member.user.username)) await member.setNickname(nickname);
            } catch (err) { }

            // Assign Roles
            try {
                const roles = member.roles.cache.array().map(r => r.id);
                if (user && !roles.includes(process.env.LINKED_ROLE)) await member.roles.add(linkedRole);
                if (!user && roles.includes(process.env.LINKED_ROLE)) await member.roles.remove(linkedRole);
                if (user && user.plus && !roles.includes(process.env.PLUS_ROLE)) await member.roles.add(plusRole);
                if (!user || (!user.plus && roles.includes(process.env.PLUS_ROLE))) await member.roles.remove(plusRole);
            } catch (err) { }
        });
    setInterval(memberList, 300000);
    memberList();
});

// Get User Data
const getUserData = async id => (
    await axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(id)}`)
).data;

// Get Alles user id
const getAllesId = async discord => (
    await axios.get(`https://discord.alles.cc/discord/${encodeURIComponent(discord)}`)
).data.alles;