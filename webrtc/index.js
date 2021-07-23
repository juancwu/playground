const express = require("express");
const ioServer = require("socket.io").Server;
const path = require("path");

const app = express();
const io = new ioServer();
const server = app.listen(8080);

const table = {};

app.use(express.static(path.join(__dirname, "public")));

io.attach(server);

io.on("connection", (socket) => {
  table[socket.id] = socket;
  socket.emit("greetings", "Hello from server.", socket.id);

  socket.broadcast.emit("new-peer", socket.id);

  socket.on("find-peers", (id, cb) => {
    let peers = Object.keys(table).filter((peerId) => peerId !== id);

    if (peers.length) cb(peers);
  });

  // send offer to peer list
  socket.on("offer", ({ offer, from, target }) => {
    io.to(target).emit("offer", { offer, from });
  });

  socket.on("answer", ({ answer, from, target }) => {
    io.to(target).emit("answer", { answer, from });
  });

  socket.on("candidate", ({ candidate, target, from }) => {
    io.to(target).emit("candidate", candidate, from);
  });

  socket.on("ping-peer", (peerId, cb) => {
    let connected = typeof table[peerId] !== "undefined";
    cb(connected);
  });

  socket.on("disconnect", () => {
    delete table[socket.id];
  });
});
