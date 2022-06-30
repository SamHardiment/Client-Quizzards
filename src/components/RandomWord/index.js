import React, { useEffect, useState } from "react";
import { socket } from "../../App";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RandomWord({
  error,

  activePlayerTrue,
  activePlayer,

  room,
  host,
}) {
  const [word, setWord] = useState("");
  const [allWords, setAllWords] = useState("");
  const [catergory, setCatergory] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  /* const [activePlayer, setActivePlayer] = useState(""); */

  useEffect(() => {
    showModal();
  }, [activePlayer]);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  socket.on("recieveAllWords", (data) => {
    setAllWords(data);
  });

  /*  socket.on("recieveActivePlayerChange", (activePlayerChange) => {
    setActivePlayer(activePlayerChange);
  }); */

  socket.on("recieveCatergory", (catergoryChoice) => {
    setCatergory(catergoryChoice);
  });

  socket.on("recieveCatergoryHost", (catergoryChoice, room) => {
    setCatergory(catergoryChoice);
  });

  const handleNewWord = () => {
    const wordObj = allWords[[Math.floor(Math.random() * allWords.length)]];
    // setWord visible to only active player --> send masked word to everyone else
    const randomWord = wordObj.word;
    socket.emit("sendRandomWord", randomWord, room);

    hideModal();
  };

  socket.on("recieveRandomWord", (randomWord) => {
    if (activePlayerTrue) {
      setWord(randomWord);
    } else {
      setWord(randomWord.split("").fill("_").join(" "));
    }
    hideModal();
    // setCatergory(catergoryChoice);
  });

  return (
    <>
      <div className="randomWordContainer">
        <div>
          {error ? (
            <h3>{error}</h3>
          ) : (
            <h3 className="gameTitle">Catergory: {catergory}</h3>
          )}
        </div>
        <p className="word">{word ? word : "Press Start To Begin"}</p>
      </div>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          {host ? "Start Round!" : "Wait for game to begin"}
        </Modal.Header>
        <Modal.Body>
          {host ? <button onClick={handleNewWord}>Random Word</button> : ""}
        </Modal.Body>
      </Modal>
    </>
  );
}
