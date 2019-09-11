const electron = require("electron");
const app = electron.app;
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow;
const path = require("path");

const {
  exitPyProc,
  createPyProc
} = require('./scraper.js')

console.log = process.env.NODE_ENV === 'development' ? console.log : require('electron-log').info;

/*************************************************************
 * py process
 *************************************************************/

app.on("ready", createPyProc);
app.on("will-quit", exitPyProc);

/*************************************************************
 * window management
 *************************************************************/

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    vibrancy: "appearance-based",
    icon: __dirname + "Icon.icns",
    height: 970,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    require("url").format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  process.env.NODE_ENV == 'development' && mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    app.quit();
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});