import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3002");

function App() {
  // Room state
  const [room, setRoom] = useState("");

  // Message state
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");

  // Emit event to join room
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  // Emit event to send message
  const sendMessage = () => {
    // Send data to backend
    socket.emit("send_message", { message, room });
  };

  // Display message
  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessageRecieved(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h3>Message:</h3>
      {messageRecieved}
    </div>
  );
}

export default App;
