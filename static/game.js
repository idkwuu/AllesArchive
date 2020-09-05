const getCookie = name => {
    match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

const token = getCookie("token");
const maxDeathStrikes = 30;
let deathStrikes = 0;
let gameData;
let playerCredentials;
let me;

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
                playerCredentials = null;
                shooting = false;

                // Get new subtitle
                getSubtitle()
                    .then(async s => {
                        subtitle.innerText = s;
                        gameMenu.classList.remove("hidden");
                    })
                    .catch(() => gameMenu.classList.remove("hidden"));
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
        }
        else if (res.status === 401) location.href = "/auth";
        else throw new Error();
    }).catch(() => showError("Something went wrong."));
};

// Error Display
const showError = msg => {
    subtitle.innerText = `Error: ${msg}`;
    subtitle.classList.add("error");
};

// Get Subtitle
const getSubtitle = async () => {
    const res = await fetch("/subtitle", {
        headers: {
            authorization: token
        }
    });
    if (res.status !== 200) throw new Error();
    return await res.text();
};