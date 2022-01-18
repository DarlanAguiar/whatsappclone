import React, { useState, useEffect, useRef } from "react";
import {
  MdSearch,
  MdAttachFile,
  MdMoreVert,
  MdInsertEmoticon,
  MdClose,
  MdSend,
  MdMic,
} from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import MessageItem from "./MessageItem";
import Api from "../Api";

import "./ChatWindow.css";

const ChatWindow = ({ dados, user }) => {
  //jogando o scroll do body para baixo para visualizar as ultimas mensagen, lembre de add um ref na div body
  const body = useRef();

  let reconhecimento = null;

  let reconhecimentoDeFala =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (reconhecimentoDeFala !== undefined) {
    reconhecimento = new reconhecimentoDeFala();
  }

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [ouvindo, setOuvindo] = useState(false);
  const [listaConversas, setListaConversas] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setListaConversas([]);
    let unsub = Api.onChatContent(dados.chatId, setListaConversas, setUsers);
    return unsub;
  }, [dados.chatId]);

  useEffect(() => {
    //conteúdo do body é maior que a altura do próprio body(ou seja tem barra de rolagem?)
    if (body.current.scrollHeight > body.current.offsetHeight) {
      //jogando a barra de rolagem para baixo
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [listaConversas]);

  const handleEmojiClick = (e, emojiObject) => {
    setText(text + emojiObject.emoji);
  };

  const handleOpenEmoji = () => {
    setEmojiOpen(true);
  };

  const handleEmojiClose = () => {
    setEmojiOpen(false);
  };

  const handleSendclick = () => {
    if(text !== ""){
      Api.sendMessage(dados, user.id, "text", text, users);
      setText("");
      setEmojiOpen(false);
    }
  };

  const handleInputKeyUp = (e) => {
    if(e.keyCode === 13) {
      handleSendclick()
    }
  }

  const handleMicClick = () => {
    if (reconhecimento !== null) {
      reconhecimento.onstart = () => {
        setOuvindo(true);
      };

      reconhecimento.onend = () => {
        setOuvindo(false);
      };

      reconhecimento.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };

      reconhecimento.start();
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatWindow--header">
        <div className="chatWindow--headerinfo">
          <img
            src={dados.image}
            alt="foto do usuario"
            className="chatWindow--avatar"
          />
          <div className="chatWindow--name">{dados.title}</div>
        </div>

        <div className="chatWindow--headerbuttons">
          <div className="chatWindow--btn">
            <MdSearch style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn">
            <MdAttachFile style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn">
            <MdMoreVert style={{ color: "#919191" }} />
          </div>
        </div>
      </div>
      <div ref={body} className="chatWindow--body">
        {listaConversas.map((item, key) => (
          <MessageItem key={key} data={item} user={user} />
        ))}
      </div>

      <div
        className="chatWindow--emojiarea"
        style={{ height: emojiOpen ? "200px" : "0" }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} disableSearchBar />
      </div>

      <div className="chatWindow--footer">
        <div className="chatWindow--pre">
          <div
            className="chatWindow--btn"
            onClick={handleEmojiClose}
            style={{ width: emojiOpen ? 40 : 0 }}
          >
            <MdClose fontSize={25} style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn" onClick={handleOpenEmoji}>
            <MdInsertEmoticon
              fontSize={25}
              style={{ color: emojiOpen ? "#009688" : "#919191" }}
            />
          </div>
        </div>

        <div className="chatWindow--inputarea"></div>
        <input
          className="chatWindow--input"
          type="text"
          placeholder="Digite uma mensagem"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyUp={handleInputKeyUp}
        />
        <div className="chatWindow--pos">
          {text === "" && (
            <div className="chatWindow--btn" onClick={handleMicClick}>
              <MdMic
                fontSize={25}
                style={{ color: ouvindo ? "#126ece" : "#919191" }}
              />{" "}
            </div>
          )}
          {text !== "" && (
            <div className="chatWindow--btn" onClick={handleSendclick}>
              <MdSend style={{ color: "#919191" }} />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
