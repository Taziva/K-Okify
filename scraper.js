const path = require("path");

const PY_DIST_FOLDER = "lyrics_scraper_dist";
const PY_FOLDER = "lyrics_scraper";
const PY_MODULE = "api";

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
    return 4242;
};

const exitPyProc = (pyProc) => {
    pyProc.kill();
    pyProc = null;
    pyPort = null;
};

const createPyProc = () => {
    let script = getScriptPath();
    let port = "" + selectPort();

    if (guessPackaged()) {
        pyProc = require("child_process").execFile(script, [port], {
            stdio: 'inherit'
        });
    } else {
        pyProc = require("child_process").spawn("python", [script, port], {
            stdio: 'inherit'
        });
    }

    if (pyProc != null) {
        console.log("child process success on port " + port);
    }
};

module.exports = {
    exitPyProc,
    createPyProc
}