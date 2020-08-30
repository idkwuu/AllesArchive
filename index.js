require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const quickauth = require("@alleshq/quickauth");
const User = require("./db");
const { Op } = require("sequelize");
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

            // Check if account is already connected
            if (await User.findOne({
                where: {
                    [Op.or]: [
                        { alles },
                        { discord }
                    ]
                }
            })) return res.status(400).send("This discord account or AllesID is already connected!");

            // Create record
            await User.create({
                alles,
                discord
            });

            // Add XP
            nexus("POST", `users/${alles}/xp`, { xp: 250 }).catch(() => { });

            // Response
            res.send("All done! Your AllesID and Discord account are now connected!");
        })
        .catch(() => res.status(401).json({ err: "badAuthorization" }));
});

// Discord -> Alles API
app.get("/alles/:id", async (req, res, next) => {
    const user = await User.findOne({
        where: {
            alles: req.params.id
        }
    });
    if (user) res.json(user);
    else next();
});

// Alles -> Discord API
app.get("/discord/:id", async (req, res, next) => {
    const user = await User.findOne({
        where: {
            discord: req.params.id
        }
    });
    if (user) res.json(user);
    else next();
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
    me: async msg => {
        try {
            await userStats((await User.findOne({ where: { discord: msg.author.id } })).alles, msg);
        } catch (err) {
            await msg.channel.send(`Your discord account is not currently connected to an AllesID. Run \`${process.env.PREFIX}link\` to link it!`);
        }
    },
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

                await userStats(id, msg);
            } catch (err) {
                await msg.channel.send("That user doesn't seem to exist");
            }
        } else await msg.channel.send("You must specify the user id");
    },
    xp: async msg => {
        let user;
        try {
            user = await getUserData((await User.findOne({ where: { discord: msg.author.id } })).alles);
        } catch (err) {
            return await msg.channel.send(`Sorry, ${msg.author}, you'll need to connect your AllesID first. Try \`${process.env.PREFIX}link\``);
        }

        if (user.xp.level >= 50) return await msg.channel.send(`bruh, you're on level ${user.xp.level} smh`);

        // Check cooldown
        if (xpDates[user.id] && xpDates[user.id] > new Date().getTime() - 1000 * 60 * 60) {
            const minsLeft = Math.ceil(((xpDates[user.id] + 1000 * 60 * 60) - new Date().getTime()) / (1000 * 60));
            return await msg.channel.send(`Hold up, ${msg.author}! You still have to wait ${minsLeft} minute${minsLeft === 1 ? "" : "s"} before you can do this again.`);
        }

        xpDates[user.id] = new Date().getTime();
        try {
            // Increase XP
            await nexus("POST", `users/${user.id}/xp`, { xp: 5 });

            // Increase Server Owner XP
            try {
                await nexus("POST", `users/${
                    (
                        await User.findOne({
                            where: {
                                discord: msg.guild.owner.id
                            }
                        })
                    ).alles
                }/xp`, { xp: 1 });
            } catch (err) { conso }

            // Message
            await msg.channel.send(`Boop! +5xp!`);
        } catch (err) {
            await msg.channel.send(`Oh no! Something went wrong when trying to add your xp, ${msg.author}!`)
        }
    }
};

// Bot
bot.login(process.env.BOT_TOKEN).then(async () => {
    console.log("Bot is online");

    // On Message
    bot.on("message", async msg => {
        if (msg.content.startsWith(process.env.PREFIX) && msg.guild) {
            const cmdString = msg.content.substr(process.env.PREFIX.length).toLowerCase();
            const cmd = commands[cmdString.split(" ")[0]];
            try {
                if (cmd) await cmd(msg, cmdString);
                else await msg.channel.send(`Sorry, ${msg.author}, that command doesn't exist! Try ${process.env.PREFIX}help to see all the commands you can use :)`);
            } catch (err) { }
        }
    });
});

// Get User Data
const getUserData = async id => (
    await axios.get(`https://horizon.alles.cc/users/${encodeURIComponent(id)}`)
).data;

// Get User ID from name#tag
const nametag = async (name, tag) => (
    await axios.get(`https://horizon.alles.cc/nametag?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`)
).data.id;

// Escape
const esc = content => content
    .replace(/@everyone/g, "@.everyone")
    .replace(/@here/g, "@.here");

// Nexus
const nexus = async (method, endpoint, data) => (await axios({
    method,
    url: `${process.env.NEXUS_URI}/${endpoint}`,
    data,
    auth: {
        username: process.env.NEXUS_ID,
        password: process.env.NEXUS_SECRET
    }
})).data;

// User Stats
const userStats = async (id, msg) => {
    const user = await getUserData(id);
    const progress = Math.round(user.xp.levelProgress * 10);
    await msg.channel.send(
        `**ID:** ${user.id}\n` +
        `**Name:** ${esc(user.name)}\n` +
        `**Tag:** #${user.tag}\n` +
        `**Nickname:** ${esc(user.nickname)}\n` +
        `**XP:** ${user.xp.total} (Level ${user.xp.level}, ${user.xp.levelXp}/${user.xp.levelXpMax})\n` +
        `${"▓".repeat(progress)}${"░".repeat(10 - progress)} ${Math.floor(user.xp.levelProgress * 100)}%` +
        (user.plus ? "\n\n✨ _This user has **Alles+**_ ✨" : "")
    );
}