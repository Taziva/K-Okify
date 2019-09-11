const electron = require("electron");
const app = electron.app;
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow;
const path = require("path");

/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = "lyrics_scraper_dist";
const PY_FOLDER = "lyrics_scraper";
const PY_MODULE = "api"; // without .py suffix

let pyProc = null;
let pyPort = null;

const guessPackaged = () => {
  const fullPath = path.join(__dirname, "../", PY_DIST_FOLDER);
  return require("fs").existsSync(fullPath);
};

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py");
  }
  if (process.platform === "win32") {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + ".exe");
  }
  return path.join(__dirname, "../", PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
};

const selectPort = () => {
  pyPort = 4242;
  return pyPort;
};

const createPyProc = () => {
  let script = getScriptPath();
  let port = "" + selectPort();


  const template = [{
    label: "Application",
    submenu: [{
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function () {
          app.quit();
        }
      }
    ]
  }, {
    label: "Edit",
    submenu: [{
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  if (guessPackaged()) {
    pyProc = require("child_process").execFile(script, [port]);
  } else {
    pyProc = require("child_process").spawn("python", [script, port]);
  }

  if (pyProc != null) {
    console.log("child process success on port " + port);
  }
};

const exitPyProc = () => {
  pyProc.kill();
  pyProc = null;
  pyPort = null;
};

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

  mainWindow.webContents.openDevTools();


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