const axios = require("axios");
const fs = require("fs");
const Discord = require("discord.js");
const bot = new Discord.Client();

// Commands
const help = fs.readFileSync(`${__dirname}/help.md`, "utf8").replace(/\$/g, process.env.PREFIX);
const commands = {
    help: msg => msg.channel.send(help),
    nope: msg => msg.channel.send("https://tenor.com/view/folding-ideas-foldingideas-dan-olson-nope-gif-14177991"),
    user: async (msg, cmd) => {
        if (cmd.split(" ").length > 1) {
            try {
                let id = cmd.split(" ");
                id.shift();
                id = id.join(" ");
                if (id.split("#").length > 1) {
                    let name = id.split("#");
                    const tag = name.pop();
                    name = name.join("#");
                    id = await nametag(name, tag);
                } else if (id.length !== 36)
                    return msg.channel.send("You need to specify the user using an id or name#tag");

                const user = await getUserData(id);
                const progress = Math.round(user.xp.levelProgress * 10);
                msg.channel.send(
                    `**ID:** ${user.id}\n` +
                    `**Name:** ${esc(user.name)}\n` +
                    `**Nickname:** ${esc(user.nickname)}\n` +
                    `**XP:** ${user.xp.total} (Level ${user.xp.level}, ${user.xp.levelXp}/${user.xp.levelXpMax})\n` +
                    `${"▓".repeat(progress)}${"░".repeat(10 - progress)} ${Math.floor(user.xp.levelProgress * 100)}%` +
                    (user.plus ? "\n\n✨ _This user has **Alles+**_ ✨" : "")
                );
            } catch (err) {
                msg.channel.send("That user doesn't seem to exist");
            }
        } else msg.channel.send("You must specify the user id");
    },
    whoami: async msg => {
        let user;
        try {
            user = await getUserData(await userFromDiscord(msg.author.id));
        } catch (err) { }

        msg.channel.send(
            `You are ${msg.author}` +
            (user ?
                `, or ${esc(user.name)}#${user.tag} on Alles (${user.id})` :
                ". Your discord account is not currently connected to an AllesID. Visit https://alles.cx/connections for more information."
            )
        );
    },
    xp: msg => msg.channel.send("*Coming soon!*")
};

// Bot
bot.login(process.env.BOT_TOKEN).then(async () => {
    console.log("Bot is online");
    const server = bot.guilds.cache.first();
    const linkedRole = await server.roles.fetch(process.env.LINKED_ROLE);
    const plusRole = await server.roles.fetch(process.env.PLUS_ROLE);

    // On Message
    bot.on("message", async msg => {
        if (msg.content.startsWith(process.env.PREFIX)) {
            const cmdString = msg.content.substr(process.env.PREFIX.length).toLowerCase();
            const cmd = commands[cmdString.split(" ")[0]];
            if (cmd) await cmd(msg, cmdString);
            else msg.channel.send(`Sorry, ${msg.author}, that command doesn't exist! Try ${process.env.PREFIX}help to see all the commands you can use :)`);
        }
    });

    // Members
    const memberList = async () => (await server.members.fetch())
        .forEach(async member => {
            let user;
            try {
                user = await getUserData(await userFromDiscord(member.user.id));
            } catch (err) { }

            // Set Name
            try {
                const nickname = user ? `${user.name.substr(0, 27)}#${user.tag}` : null;
                if (member.nickname !== nickname) await member.setNickname(nickname);
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
    setInterval(memberList, 60000);
    memberList();
});

// Get User Data
const getUserData = async id => (
    await axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(id)}`)
).data;

// Get User ID from name#tag
const nametag = async (name, tag) => (
    await axios.get(`https://horizon.alles.cc/nametag?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`)
).data.id;

// Get User ID from Discord ID
const userFromDiscord = async discord => {
    const { alles } = (await axios.get(
        `https://pizza.alles.cc/fec36e89-cc5f-4111-9191-9096eb1097d1/discord/${encodeURIComponent(discord)}`
    )).data;
    if (alles) return alles;
    else throw new Error("Alles id not set");
};

// Escape
const esc = content => content
    .replace(/@everyone/g, "@.everyone")
    .replace(/@here/g, "@.here");