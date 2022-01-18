import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import Api from "../Api";

import "./NewChat.css";

const NewChat = ({ user, chatList, show, setShow }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const pegaLista = async () => {
      //result recebe a resposta da lista vinda  da api
      if (user !== null) {
        let results = await Api.getContactList(user.id);

        setList(results);
      }
    };

    pegaLista();
  }, [user]);

  const addNewChat = async (otherUser) => {
    await Api.addNewChat(user, otherUser);

    handleClose();
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="newChat" style={{ left: show ? 0 : -415 }}>
      <div className="newChat--head">
        <div className="newChat--backbutton" onClick={handleClose}>
          <MdArrowBack style={{ color: "#fff" }} />
        </div>
        <div className="newChat--headtitle">Nova conversa</div>
      </div>
      <div className="newChat--list">
        {list.map((item, key) => (
          <div
            className="newChat--item"
            key={key}
            on
            onClick={() => addNewChat(item)}
          >
            <img
              className="newChat--avatar"
              src={item.avatar}
              alt="foto avatar"
            />
            <div className="newChat--itemname">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
