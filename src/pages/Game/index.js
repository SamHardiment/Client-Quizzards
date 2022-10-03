import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { socket } from "../../App";
import "../../App.css";
import {
  NewCanvas,
  DisplayBox,
  MessageBox,
  Users,
  Countdown,
  RandomWord,
} from "../../components";

const Game = () => {
  const [room, setRoom] = useState("");
  const [user, setUser] = useState("");
  const [players, setPlayers] = useState([]);
  const [catergory, setCatergory] = useState("");
  const [host, setHost] = useState(false);
  const [points, setPoints] = useState(0);
  const [activePlayer, setActivePlayer] = useState("");
  const [activePlayerTrue, setActivePlayerTrue] = useState(false);
  const [activePlayers, setActivePlayers] = useState([]);
  const [allWords, setAllWords] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [guessedUsers, setGuessedUsers] = useState("");
  const [timerGameChange, setTimerGameChange] = useState(false);

  const isMounted = useRef(false);

  const navigate = useNavigate();

  //Sockets -----------------------------------------------------------------------------------

  //Getting all data from home page and setting it

  socket.on(
    "recieveData",
    (roomData, userData, playersData, catergory, mode, host) => {
      setPlayers([...playersData]);
      setRoom(roomData);
      setUser(userData);
      setCatergory(catergory);
      setMode(mode);
      setHost(host);
      setActivePlayers([...playersData]);
    }
  );

  //Setting host as first active player

  useEffect(() => {
    if (host) {
      setActivePlayer(user);
    }
  }, [host]);

  useEffect(() => {
    if (host) {
      socket.emit("sendActivePlayerChange", activePlayer, room);
    }
  }, [activePlayer]);

  useEffect(() => {
    if (activePlayer != "") {
      if (user === activePlayer) {
        setActivePlayerTrue(true);
      }
    }
  }, [activePlayer]);

  socket.on("recieveActivePlayerChange", (activePlayerChange) => {
    setActivePlayer(activePlayerChange);
  });

  socket.on("recieveRemoveActivePlayer", (activePlayer) => {
    if (user == activePlayer) {
      setActivePlayerTrue(false);
    }
  });

  socket.on("recieveNavigateToGameOver", () => {
    navigate("/gameover", { replace: true });
  });

  //Adding to guessed array to change turn

  socket.on("recieveGuessed", (guessedArray, user) => {
    if (host) {
      setGuessedUsers([...guessedUsers, user]);
    }
  });

  //Resetting the game, either time is up or all players have guessed-----------------------------------------------------

  //Time is up

  socket.on("recieveTimesUp", () => {
    setTimerGameChange(!timerGameChange);
  });

  useEffect(() => {
    if (isMounted.current) {
      getNextPlayer();
    } else {
      isMounted.current = true;
    }
  }, [timerGameChange]);

  //All players have guessed

  useEffect(() => {
    if (guessedUsers.length == players.length - 1) {
      getNextPlayer();
    }
  }, [guessedUsers]);

  const getNextPlayer = () => {
    if (activePlayers.length === 1) {
      setActivePlayer(activePlayers[0]);
      activePlayers.splice(0, 1);
    } else {
      activePlayers.splice(activePlayers.indexOf(activePlayer), 1);
    }
    if (activePlayers.length === 0) {
      socket.emit("sendNavigateToGameOver", room);
      navigate("/gameover", { replace: true });
    }

    const randomPlayer =
      activePlayers[Math.floor(Math.random() * activePlayers.length)];
    if (user == activePlayer) {
      setActivePlayerTrue(false);
    }
    socket.emit("sendRemoveActivePlayer", activePlayer, room);
    socket.emit("sendResetTimers", room);
    setActivePlayer(randomPlayer);
    setGuessedUsers([]);
  };

  ////////  RandomWord

  useEffect(() => {
    if (host) {
      const getWords = async (catergory) => {
        if (catergory) {
          try {
            const { data } = await axios.get(
              `https://quizzards-the-game.herokuapp.com/${catergory}`
            );
            setAllWords(data);
            socket.emit("sendCatergory", catergory, room);
            socket.emit("sendCatergoryHost", catergory, room);
          } catch (err) {
            setError(err);
          }
        }
      };
      getWords(catergory);
    }
  }, [catergory]);

  useEffect(() => {
    if (allWords) {
      socket.emit("sendAllWords", allWords, room);
    }
  }, [allWords]);

  return (
    <>
      <div className="bkImgGame"></div>
      <div className="randomWord">
        <RandomWord
          error={error}
          catergoryChoice={catergory}
          activePlayerTrue={activePlayerTrue}
          activePlayer={activePlayer}
          room={room}
          host={host}
        />
      </div>
      <div className="gamePageContainer">
        <div className="UserComponent">
          {/* <Countdown /> */}
          <Users
            room={room}
            userCheck={user}
            players={players}
            points={points}
            activePlayer={activePlayer}
          />
        </div>
        <div className="canvas-container">
          <NewCanvas
            room={room}
            user={user}
            players={players}
            activePlayer={activePlayer}
            activePlayerTrue={activePlayerTrue}
            mode={mode}
          />
        </div>

        <MessageBox
          room={room}
          user={user}
          players={players}
          activePlayer={activePlayer}
        />
      </div>
    </>
  );
};

export default Game;
