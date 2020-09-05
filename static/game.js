const getCookie = name => {
    match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

const token = getCookie("token");
const maxDeathStrikes = 30;
var deathStrikes;
var gameData;
var playerCredentials;
var me;

const splashTexts = [
    "pew pew pew",
    "made with \u2764\ufe0f by alles",
    "now with 100% less sugar!",
    "remember fortnite? imagine that but without murder",
    "use a scroll wheel to zoom in and out",
    "made with *magic*. and also javascript.",
    "open-source on github",
    "also try Minecraft",
    "follow @alleshq on Twitter",
    "as seen on YouTube",
    "han shot first",
    "qonya blez sehr qwa spok",
    "powered by the interwebz",
    "it's javascript, not java",
    "not available on steam",
    "trigonometry!",
    "the plague spreads through bullets",
    "made in \u{1F1EC}\u{1F1E7}",
    "may contain nuts",
    "zero sales and counting",
    "made with circles",
    "multiplayer!",
    "words go here",
    "not touchscreen-friendly!",
    "nothing to see here",
    "not to be played on internet explorer",
    "what you're referring to as linux, is in fact, gnu/linux",
    "no, richard, it's 'linux', not 'gnu/linux'",
    "thanks for playing",
    "html5 canvas",
    "powered by pixels",
    "this text changes every time you die",
    "emoticons (\u2022\u25e1\u2022)",
    "Version 69",
    "made by Archie",
    "cAPS lOCK",
    "may contain string interpolation",
    "powered by binary",
    "may the force be with you",
    "there's no place like 127.0.0.1",
    "et phone home",
    "just keep swimming",
    "roads? where we're going, we don't need roads.",
    "to infinity and beyond"
];

// User data
fetch("/user", {
    headers: {
        authorization: token
    }
}).then(res => {
    if (res.status === 200) {
        res.json().then(user => {
            subtitle.innerText = "Signed in as ";
            const span = document.createElement("span");
            span.innerText = `${user.name}#${user.tag}`;
            subtitle.appendChild(span);
        });
    } else throw new Error();
}).catch(() => {
    subtitle.innerText = "Sign in with Alles to play...";
    button.innerText = "Sign in";
});

// Socket.io
const socket = io();
socket.on("data", data => {
    gameData = data;
    if (playerCredentials) {
        me = gameData.players[playerCredentials.id];
        if (!me) {
            if (deathStrikes < maxDeathStrikes) {
                deathStrikes++;
            } else {
                // Death
                playerCredentials = undefined;
                shooting = false;
                subtitle.innerText = splashTexts[Math.floor(Math.random() * splashTexts.length)];
                gameMenu.classList.remove("hidden");
            }
            return;
        };
        render();
    }
});

// Player Action
const playerAction = (action, param) => {
    if (!playerCredentials) return;
    socket.emit("action", {
        id: playerCredentials.id,
        secret: playerCredentials.secret,
        action,
        param
    });
};

// Start Game
button.onclick = () => {
    if (!token) return location.href = "/auth";

    // Create Player
    fetch("/join", {
        method: "post",
        headers: {
            authorization: token
        }
    }).then(res => {
        if (res.status === 200) {
            res.json().then(body => {
                // Game Starts
                playerCredentials = body;
                gameMenu.classList.add("hidden");
                subtitle.classList.remove("error");
                subtitle.innerText = "";
                deathStrikes = 0;
            });
        } else if (res.status === 429) {
            showError("You seem to be playing already.");
        } else if (res.status === 401) {
            location.href = "/auth";
        }
    }).catch(() => showError("Something went wrong."));
};

// Error Display
const showError = msg => {
    subtitle.innerText = `Error: ${msg}`;
    subtitle.classList.add("error");
};