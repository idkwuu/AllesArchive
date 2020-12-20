const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Notification,
  shell,
} = require("electron");
const electronDev = require("electron-is-dev");
const handleQuery = require("./query");
const { paths, apiUrl, axiosOptions } = require("./config");
const axios = require("axios");
const os = require("os");
const fs = require("fs");
let dev = electronDev;

// Prevent Multiple Instances
if (!app.requestSingleInstanceLock()) {
  console.log("Pulsar is already running!");
  process.exit();
}

// Get theme stylesheet
let theme = "";
try {
  theme = fs.readFileSync(`${paths.config}/theme.css`, "utf8");
} catch (err) {}

// Create Window
let win;
const createWindow = () => {
  // Prevent Duplicate Input Windows
  if (win) return;

  // Create Window
  win = new BrowserWindow({
    width: 800,
    height: 150,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      enableRemoteModule: true,
    },
    show: false,
  });

  // Load URL
  win.loadURL(
    electronDev
      ? "http://localhost:5000"
      : `file://${__dirname}/build/index.html`
  );

  // Show when ready
  win.on("ready-to-show", win.show);

  // Close on blur
  win.on("blur", () => {
    if (!dev) win.close();
  });

  // On Close
  win.on("close", () => (win = null));

  // Open URLs in browser
  win.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
    win.close();
  });
};

app.on("ready", () => {
  // Shortcut
  globalShortcut.register(
    process.platform === "darwin" ? "Option+A" : "Alt+A",
    createWindow
  );
});

// Prevent stopping app when windows close
app.on("window-all-closed", (e) => e.preventDefault());

// Autolaunch
const AutoLaunch = require("auto-launch");
const autoLauncher = new AutoLaunch({
  name: "Pulsar",
});
if (!electronDev) autoLauncher.enable();

// Update Window Height
ipcMain.on("set-height", (_event, height) => {
  const width = win.getSize()[0];
  win.setMinimumSize(width, height);
  win.setSize(width, height);
  win.center();
});

// Query
ipcMain.on("query", async (event, id, query) => {
  try {
    const response = await handleQuery(query);
    if (query === "I am a developer") {
      dev = true;
      if (win) win.webContents.openDevTools();
      response.banner = "Developer Mode Enabled";
    }
    event.reply(`query-${id}`, {
      id,
      ...response,
    });
  } catch (err) {}
});

// Response
ipcMain.on("response", async (_event, response) => {
  if (!response.startsWith("$"))
    axios
      .post(`${apiUrl}/response`, { response }, axiosOptions)
      .then(() => {})
      .catch(() => {});
  else {
    const cmd = response.split(" ")[0].substr(1);
    const commands = {
      restart: () => {
        app.relaunch();
        app.exit();
      },
    };
    if (commands[cmd]) await commands[cmd]();
  }
});

// Fetch Data
let data;
const fetchData = async () => {
  try {
    data = (await axios.get(`${apiUrl}/data`, axiosOptions)).data;

    // Get new theme
    let themeId = theme.split("\n")[0];
    if (themeId.split(" ").length === 3) themeId = themeId.split(" ")[1];
    if (data.theme && data.theme !== themeId) {
      try {
        theme =
          "/* " +
          data.theme +
          " */\n\n" +
          (await axios.get(`https://pulsar-themes.alles.cc/${data.theme}.css`))
            .data;
        fs.writeFileSync(`${paths.config}/theme.css`, theme);

        // Notification
        new Notification({
          title: "New Theme!",
          body: "A new theme was added to Pulsar.",
        }).show();

        // Restart App
        app.relaunch();
        app.exit();
      } catch (err) {}
    }
  } catch (err) {
    if (err.response) data = err.response.data;
    else data = undefined;
  }
};
fetchData();
setInterval(fetchData, 1000);

// Connect Token
let connectToken;
axios
  .post(
    `${apiUrl}/connectToken`,
    {
      name: os.hostname(),
      platform: os.platform(),
    },
    axiosOptions
  )
  .then((res) => {
    connectToken = res.data.token;
    setInterval(() => {
      if (!data || data.err)
        axios
          .post(
            `${apiUrl}/activate`,
            {
              token: connectToken,
            },
            axiosOptions
          )
          .then((res) => {
            // Save Credentials
            fs.writeFileSync(
              `${paths.config}/credentials.json`,
              JSON.stringify({
                id: res.data.id,
                secret: res.data.secret,
              })
            );

            // Notification
            new Notification({
              title: "You're connected!",
              body: "Pulsar was successfully linked to an AllesID.",
            }).show();

            // Restart App
            app.relaunch();
            app.exit();
          })
          .catch(() => {});
    }, 5000);
  })
  .catch(() => {});

// Pass Data to Renderer
setInterval(() => {
  try {
    if (win)
      win.webContents.send(
        "data",
        data && {
          ...data,
          connectToken,
        }
      );
  } catch (err) {}
}, 50);
