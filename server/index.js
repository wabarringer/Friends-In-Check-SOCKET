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

// TODO: User joins a room from the home page
// TODO: Game doesn't start until two players have entered room
// TODO: Emit Move_Piece from front end and listen to emit on backend - then emit Push_Move on backend and listen to emit on frontend
// TODO:

// Listen to user connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // listen to onPieceMoved function
  // first argument is the identifier, so make sure to match to emit on frontend
  socket.on("Move_Piece", (data) => {
    console.log("Move recieved", data);
    io.emit("Push_Move", data);
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
