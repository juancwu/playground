const express = require("express");
const ioServer = require("socket.io").Server;
const path = require("path");

const app = express();
const io = new ioServer();
const server = app.listen(8080);

const sockets = {};

app.use(express.static(path.join(__dirname, "public")));

io.attach(server);

io.on("connection", (socket) => {
  sockets[socket.id] = socket;
  socket.emit("greetings", "Hello from server.", socket.id);

  socket.broadcast.emit("new-peer", socket.id);

  socket.on("find-peers", (id, cb) => {
    let peers = Object.keys(sockets).filter((peerId) => peerId !== id);

    cb([...peers]);
  });

  socket.on("ping-peer", (id, cb) => {
    cb(typeof sockets[id] !== "undefined");
  });

  socket.on("offer", (offer, target, from) => {
    io.to(target).emit("offer", offer, from);
  });

  socket.on("answer", (answer, target) => {
    io.to(target).emit("answer", answer);
  });

  socket.on("disconnect", () => {
    delete sockets[socket.id];
    socket.broadcast.emit("bye-peer", socket.id);
  });
});
