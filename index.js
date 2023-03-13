const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://friends-in-check.netlify.app/",
    methods: ["GET", "POST"],
  },
});

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

let rooms = {};
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
  // Join event here is run when the user navigates to that page.
  socket.on("join", ({ roomId, username }) => {
    // Join the user
    socket.join(roomId);
    // Create an array of users with the KEY of the room id. Ex; { 14: { users: [] } } if it does not exist
    console.log(`user joined ${roomId} username ${username}`);
    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }

    // Push current users to array of users for that room key.
    rooms[roomId].users.push(username);
    console.log(`Current users joined ${roomId} are ${rooms[roomId].users}`);

    // emit to users in room
    socket.to(roomId).emit("user-joined", username);
  });

  // *ALL EVENTS IN HERE ARE RAN INSIDE OF THE ROOM*
  socket.on("in-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user array", rooms[roomId].users);

    // For chat
    socket.on("send-message", ({ username, message }) => {
      let newMsg = `${username}: ${message}`;
      socket.to(roomId).emit("return-message", newMsg);
    });

    // For chess
    socket.on("move", (move) => {
      console.log("Move recieved");
      socket.to(roomId).emit("return-move", move);
    });
  });
});

server.listen(3002, () => {
  console.log("Server listening to port 3002");
});
