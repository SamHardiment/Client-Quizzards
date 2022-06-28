import React, { useState } from "react";
import { socket } from "../../App";
import { useNavigate } from "react-router-dom";

export default function HomeBox({ startReady, room, user }) {
  const [roomText, setRoomText] = useState("");
  const [players, setPlayers] = useState([]);
  const [catergoryInput, setCatergoryInput] = useState("animals");

  const navigate = useNavigate();

  socket.on("attachRoom", (room) => {
    setRoomText(room);
    /* playersArea.textContent = socket.id; */
  });

  socket.on("maxPartyError", (room) => {
    setRoomText(`The maxed room size for ${room} has been reached!`);
  });

  socket.on("addPlayer", (newPlayers, room) => {
    setPlayers([...newPlayers]);
  });
  window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
  });

  const handleSendData = (e) => {
    e.preventDefault();
    socket.emit("sendData", room, user, players);
    socket.emit("navigateAllPlayers", room);
    socket.emit("sendCatergory", room, catergoryInput);
    navigate("/game", { replace: true });
  };

  socket.on("navigateToGame", () => {
    socket.emit("sendData", room, user, players);
    navigate("/game", { replace: true });
  });

  // Category Select

  const updateCatergory = (e) => {
    const input = e.target.value;
    console.log(input);

    setCatergoryInput(input);
    console.log(catergoryInput);
  };

  return (
    <>
      <div className="home-box">
        <p className="connection"></p>
        <h3>Room Name:</h3>
        <div className="room">{roomText}</div>
        <h3>Players:</h3>
        <div className="players">
          {players.map((player) => (
            <div key={player + Math.floor(Math.random() * 10 + 1)}>
              {player}
            </div>
          ))}
        </div>
      </div>
      <form action="javascript:void(0);" className="" onSubmit={handleSendData}>
<<<<<<< HEAD
        <label htmlFor="category">Choose a category</label>
        <select
          id="category"
          name="category"
          className="textarea"
          value={catergoryInput}
          onChange={updateCatergory}
        >
          <option value="animals">Animals</option>
          <option value="food">Food</option>
          <option value="drinks">Drinks</option>
        </select>
        <button disabled={!startReady} type="submit">
=======
        <button className="start-btn" disabled={!startReady} type="submit">
>>>>>>> 85d49a512fb33da49f8111c26203827c025f1e78
          Start game!
        </button>
      </form>
    </>
  );
}
