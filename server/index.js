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

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// 1) Listen to user connection
io.on("connection", (socket) => {
  console.log("New user connected");

  // 2) Listen for host
  socket.on("host", (roomId) => {
    console.log(`User hosted room ${roomId}`);

    // 2) Create new room
    const room = io.of(`/${roomId}`);
  });

  // 3) Listen for join
  socket.on("join", ({ roomId, username }) => {
    // Join the user
    socket.join(roomId);

    // 3) Broadcast to room
    socket.to(roomId).emit("user-joined", { username });
  });
});

server.listen(3002, () => {
  console.log("Server listening to port 3002");
});
