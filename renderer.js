const zerorpc = require("zerorpc");
const Filter = require("bad-words-relaxed");

let filter = new Filter();
let client = new zerorpc.Client();
let cleanButton = document.querySelector("#clean");
let clean = false;
let lyrics, details, cleanLyrics;

cleanButton.onclick = () => {
  clean = !clean;
  updateButtonText(clean);
};

let lyricsContainer = document.querySelector("#lyrics");
let detailsContainer = document.querySelector("#details");
let artworkContainer = document.querySelector("#artwork");
let statusContainer = document.querySelector("#status");

const updateButtonText = clean => {
  clean
    ?
    (cleanButton.textContent = "Clean") :
    (cleanButton.textContent = "Explicit");
};

let server = new zerorpc.Server({
  health: function (reply) {
    reply(null, "Success");
    statusContainer.textContent = "Connected"
  },
  updateStatus: function (status, reply) {
    reply(null, "Success");
    statusContainer.textContent = status.message

  },
  error: function (error, reply) {
    reply(null, "Success");
    console.error(error);
    statusContainer.textContent = error
  },
  updateLyrics: function (content, reply) {
    reply(null, "Success");
    artwork.setAttribute("src", content.artwork);
    artwork.setAttribute("width", "300px");
    lyrics = content.lyrics;
    details = content.details;
    statusContainer.textContent = "Formatting Lyrics"

    updateText(content);

    statusContainer.textContent = "Done"
  }
});

const updateText = content => {
  lyricsContainer.textContent = lyrics;

  detailsContainer.textContent = content.details;
};

server.bind("tcp://0.0.0.0:4242");

server.on("error", function (error) {
  console.error("RPC server error:", error);
});