const axios = require("axios");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const quickauth = require("@alleshq/quickauth");
const nexus = require("@alleshq/nexus");
nexus.setCredentials(process.env.NEXUS_ID, process.env.NEXUS_SECRET);
const xpDates = {};

// Express
const express = require("express");
const app = express();
app.use(require("cookie-parser")());
app.use((_err, _req, res, _next) => res.status(500).json({ err: "internalError" }));
app.listen(8080, () => console.log("Express is listening"));
app.get("/", (_req, res) => res.redirect("https://alles.link/discord"));

// QuickAuth redirect
app.get("/token/:token", (req, res) => {
    res.cookie("discordToken", req.params.token, { sameSite: "strict" });
    res.redirect(quickauth.url(`${process.env.ORIGIN}/auth`));
});

// QuickAuth callback
app.get("/auth", (req, res) => {
    if (typeof req.query.token !== "string") return res.status(400).json({ err: "badRequest" });
    if (typeof req.cookies.discordToken !== "string") {
        if (typeof req.query.retry === "string") {
            return res.status(400).json({ err: "badAuthorization" });
        } else {
            return res.send(`<meta http-equiv="refresh" content="0; /auth?token=${encodeURIComponent(req.query.token)}&retry" />`);
        }
    };
    quickauth(req.query.token, `${process.env.ORIGIN}/auth`)
        .then(async alles => {
            const { discord } = await jwt.verify(req.cookies.discordToken, process.env.JWT_SECRET);
            let allesRecord;

            // Check if account already connected
            try {
                allesRecord = (await axios.get(`${process.env.PIZZA_BASE}/alles/${alles}`)).data;
                if (allesRecord.discord) return res.status(400).send("This AllesID is already connected to a discord account!");
            } catch (err) { }
            try {
                await axios.get(`${process.env.PIZZA_BASE}/discord/${discord}`);
                return res.status(400).send("This discord account is already connected to an AllesID!");
            } catch (err) { }

            // Create or update record
            try {
                if (allesRecord) {
                    // Update
                    await axios.patch(`${process.env.PIZZA_BASE}/alles/${alles}`, { discord }, {
                        headers: {
                            authorization: process.env.PIZZA_SECRET
                        }
                    });
                } else {
                    // Create
                    await axios.put(process.env.PIZZA_BASE, { alles, discord }, {
                        headers: {
                            authorization: process.env.PIZZA_SECRET
                        }
                    });
                }

                // Add xp
                await nexus.addXp(alles, 250);

                // Response
                res.send("All done! Your AllesID and Discord account are now connected!");
            } catch (err) {
                console.error(`Failed to ${allesRecord ? "update" : "create"} record for AllesID ${alles} => Discord ${discord}`);
                return res.status(500).send("Uh oh! Something went wrong! Please report this issue!");
            }
        })
        .catch(() => res.status(401).json({ err: "badAuthorization" }));
});

// 404
app.use((_req, res) => res.status(404).json({ err: "notFound" }));

// Discord
const Discord = require("discord.js");
const bot = new Discord.Client();

// Commands
const help = fs.readFileSync(`${__dirname}/help.md`, "utf8").replace(/\$/g, process.env.PREFIX);
const commands = {
    help: msg => msg.channel.send(help),
    link: async msg => {
        try {
            const token = jwt.sign({ discord: msg.author.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            await msg.author.send(`Hey! Ready to link your AllesID? Use this link: ${process.env.ORIGIN}/token/${token}`);
            await msg.channel.send("Awesome! I've sent you a dm, just click the link to connect your AllesID.");
        } catch (err) {
            await msg.channel.send(`Sorry, ${msg.author}, I tried to dm you but something went wrong. Make sure that you are allowing dms from me :)`);
        }
    },
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
                    return await msg.channel.send("You need to specify the user using an id or name#tag");

                const user = await getUserData(id);
                const progress = Math.round(user.xp.levelProgress * 10);
                await msg.channel.send(
                    `**ID:** ${user.id}\n` +
                    `**Name:** ${esc(user.name)}\n` +
                    `**Nickname:** ${esc(user.nickname)}\n` +
                    `**XP:** ${user.xp.total} (Level ${user.xp.level}, ${user.xp.levelXp}/${user.xp.levelXpMax})\n` +
                    `${"▓".repeat(progress)}${"░".repeat(10 - progress)} ${Math.floor(user.xp.levelProgress * 100)}%` +
                    (user.plus ? "\n\n✨ _This user has **Alles+**_ ✨" : "")
                );
            } catch (err) {
                await msg.channel.send("That user doesn't seem to exist");
            }
        } else await msg.channel.send("You must specify the user id");
    },
    whoami: async msg => {
        let user;
        try {
            user = await getUserData(await userFromDiscord(msg.author.id));
        } catch (err) { }

        await msg.channel.send(
            `You are ${msg.author}` +
            (user ?
                `, or ${esc(user.name)}#${user.tag} on Alles (${user.id})` :
                `. Your discord account is not currently connected to an AllesID. Run \`${process.env.PREFIX}link\` to link it!`
            )
        );
    },
    xp: async msg => {
        let user;
        try {
            user = await userFromDiscord(msg.author.id);
        } catch (err) {
            return await msg.channel.send(`Sorry, ${msg.author}, you'll need to connect your AllesID first. Try \`${process.env.PREFIX}link\``);
        }

        if (xpDates[user] && xpDates[user] > new Date().getTime() - 1000 * 60 * 60) {
            const minsLeft = Math.ceil(((xpDates[user] + 1000 * 60 * 60) - new Date().getTime()) / (1000 * 60));
            return await msg.channel.send(`Hold up, ${msg.author}! You still have to wait ${minsLeft} minute${minsLeft === 1 ? "" : "s"} before you can do this again.`);
        }

        xpDates[user] = new Date().getTime();
        try {
            await nexus.addXp(user, 5);
            await msg.channel.send(`Boop! +5xp!`);
        } catch (err) {
            await msg.channel.send(`Oh no! Something went wrong when trying to add your xp, ${msg.author}!`)
        }
    }
};

// Bot
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