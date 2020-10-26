const { ipcRenderer, shell, remote } = require("electron");
const paths = require("env-paths")("pulsar", { suffix: "" });
const fs = require("fs");

// Get theme stylesheet
let theme = "";
try {
  theme = fs.readFileSync(`${paths.config}/theme.css`, "utf8");
} catch (err) {}

// Set window height
const minHeight = 75;
let height = 75;
setInterval(() => {
  let h = document.querySelector("#root").getBoundingClientRect().height;
  if (h < minHeight) h = minHeight;
  if (height !== h) {
    height = h;
    ipcRenderer.send("set-height", h);
  }
}, 10);

// Pulsar object
window.Pulsar = {
  // Query
  query: (id, query) =>
    new Promise((resolve) => {
      ipcRenderer.on(`query-${id}`, (_event, data) => resolve(data));
      ipcRenderer.send("query", id, query);
    }),
  close: () => remote.getCurrentWindow().close(),
  openUrl: (url) => shell.openExternal(url),
  theme,
};
