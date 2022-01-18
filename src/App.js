import React, { useState, useEffect } from "react";
import { MdDonutLarge, MdChat, MdMoreVert, MdSearch } from "react-icons/md";

import Api from "./Api";

import "./App.css";
import ChatIntro from "./components/ChatIntro";
import ChatListItem from "./components/ChatListItem";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import NewChat from "./components/NewChat";

function App() {
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  /* const [user, setUser] = useState({
    id: "uK9gOIJej3MGreXGLByq2XMuJ0O2",
    name: "Darlan aguiar",
    avatar: "https://graph.facebook.com/4329625753810099/picture",
  }); */

  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(()=> {
    if(user !== null){
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub;
    }

  }, [user])

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleLoginData = async (u) => {
   
    let newUser = {
      
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL,
    };

    await Api.addUser(newUser);

    setUser(newUser);
  };

  if (user === null) {
    return <Login onReceive={handleLoginData} />;
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          chatList={chatList}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img
            src={user.avatar}
            alt="avatarm avatar"
            className="header--avatar"
          />

          <div className="header--buttons">
            <div className="header--btn">
              <MdDonutLarge style={{ color: "#919191" }} />
            </div>

            <div className="header--btn" onClick={handleNewChat}>
              <MdChat style={{ color: "#919191" }} />
            </div>

            <div className="header--btn">
              <MdMoreVert style={{ color: "#919191" }} />
            </div>
          </div>
        </header>

        <div className="search">
          <div className="search--input">
            <MdSearch fontSize={"small"} style={{ color: "#919191" }} />

            <input
              type={"search"}
              placeholder="Procurar ou começar uma nova conversa"
            />
          </div>
        </div>

        <div className="chatlist">
          {chatList.map((item, key) => (
            <ChatListItem
              key={key}
              data={item}
              active={activeChat.chatId === chatList[key].chatId}
              onClick={() => {
                setActiveChat(chatList[key]);
              }}
            />
          ))}
        </div>
      </div>

      <div className="contentarea">
        {activeChat.chatId !== undefined && (
          <ChatWindow user={user} dados={activeChat} />
        )}

        {activeChat.chatId === undefined && <ChatIntro />}
      </div>
    </div>
  );
}

export default App;
