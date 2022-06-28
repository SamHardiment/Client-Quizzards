import React, { useState } from "react";
import { socket } from "../../App";
import ReactDOM from "react-dom";

export default function MessageBox() {
  const [messageInput, setMessageInput] = useState("");
  const [room, setRoom] = useState("");
  const [user, setUser] = useState("");
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);

  socket.on("recieveMessage", (messageData,roomData,userData) => {
  setMessages([...messages, userData+ " : " +messageData]);
  });

  socket.on("recieveData", (roomData, userData, playersData) => {
    setPlayers([...playersData]);
    setRoom(roomData);
    setUser(userData);
  });

  const updateMessage = (e) => {
    const input = e.target.value;
    setMessageInput(input);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();

    socket.emit("sendMessage", messageInput, room, user);
      setMessages([...messages, user+ " : " + messageInput]);
  };

  return (
    <>
      <div id="message-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </div>
      </div>

      <form
        id="message-input"
        action="javascript:void(0);"
        className=""
        onSubmit={handleSubmitMessage}
      >
        <label htmlFor="message"></label>
        <input
          type="text"
          id="message"
          name="message"
          placeholder="Message"
          value={messageInput}
          onChange={updateMessage}
        />

        <div className="form-nav">
          <button type="submit" className="send-message-btn">
            Send Message
          </button>
        </div>
      </form>
    </>
  );
}
