const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// room registry
const rooms = {};

// Listen to user connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("resetGame", (data) => {
    var room = rooms[data.roomId];
    console.log("received resetGame message",data,room)
    io.emit("broadcastResetGame", room);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    var room = rooms[data.roomId];
    if (!room) {
      rooms[data.roomId] = {
        roomId : data.roomId,
        host : data.playerId,
        hostColor : "W",
      };
      room = rooms[data.roomId];
      console.log(`room ${data.roomId} created by playerId ${data.playerId}`,room)
    } else {
      if (room.guest == data.playerId || room.host == data.playerId) {
        console.log(`player ${data.playerId} already joined the room before`)
      } 
      else if (!room.guest) {
        room.guest = data.playerId;
        room.guestColor = "B";
        console.log(`room ${data.roomId} joined by guest playerId ${data.playerId}`,room)
      }
    }
    io.emit("broadcastRoom", room);
    console.log("bradcast join room updates")
  });

  // listen to onPieceMoved function
  // first argument is the identifier, so make sure to match to emit on frontend
  socket.on("message", (data) => {
    console.log("Move recieved", data);
    io.emit("broadcastMove", data);
  });

  // CHAT
  socket.on("send_message", (data) => {
    // Connect socket to room and emit to everyone into that room
    // The 'to' function specifies where you want to emit the event
    socket.to(data.room).emit("received_message", data);
  });
});

server.listen(3002, () => {
  console.log("Server listening to port 3002");
});
