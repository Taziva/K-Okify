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

const updateButtonText = clean => {
  clean
    ? (cleanButton.textContent = "Clean")
    : (cleanButton.textContent = "Explicit");
};

let server = new zerorpc.Server({
  health: function(reply) {
    console.log("Connected");
    reply(null, "Success");
  },
  updateStatus: function(status, reply) {
    reply(null, "Success");
    console.log(status.message);
  },
  error: function(error, reply) {
    console.error(error);
    reply(null, "Success");
  },
  updateLyrics: function(content, reply) {
    reply(null, "Success");
    artwork.setAttribute("src", content.artwork);
    artwork.setAttribute("width", "300px");
    lyrics = content.lyrics;
    details = content.details;
    updateText(content);
  }
});

const updateText = content => {
  lyricsContainer.textContent = lyrics;

  detailsContainer.textContent = content.details;
};

server.bind("tcp://0.0.0.0:4242");

server.on("error", function(error) {
  console.error("RPC server error:", error);
});
