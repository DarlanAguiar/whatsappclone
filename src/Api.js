import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import firebaseConfig from "./firebaseConfig";

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  fbPopup: async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    let result = await firebaseApp.auth().signInWithPopup(provider);
    return result;
  },
  //função para adicionar um usuario ao banco de dados
  addUser: async (u) => {
    await db
      .collection("users")
      .doc(u.id)
      .set({ name: u.name, avatar: u.avatar }, { merge: true });
  },

  //pegando a lista de contatos menos eu
  getContactList: async (userId) => {
    let list = [];

    let results = await db.collection("users").get();

    results.forEach((result) => {
      let data = result.data();

      //se id do resultado é diferente do id recebido significa qua nao sou eu
      if (result.id !== userId) {
        list.push({ id: result.id, name: data.name, avatar: data.avatar });
      }
    });

    return list;
  },

  addNewChat: async (user, otherUser) => {
    let newChat = await db.collection("chats").add({
      messages: [],
      users: [user.id, otherUser.id],
    });
    //encontrando o usuario e atualizando a lista de chats dele.
    db.collection("users")
      .doc(user.id)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          //newChat cria um id do chat
          chatId: newChat.id,
          title: otherUser.name,
          image: otherUser.avatar,
          with: otherUser.id,
        }),
      });

    db.collection("users")
      .doc(otherUser.id)
      .update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          //newChat cria um id do chat
          chatId: newChat.id,
          title: user.name,
          image: user.avatar,
          with: user.id,
        }),
      });
  },

  onChatList: (userId, setChatList) => {
    ////pega a lista do user id(no colection user, etre no userId. cuida as novidades deste usuario )
    return db
      .collection("users")
      .doc(userId)
      .onSnapshot((doc) => {
        //se o usuario existe
        if (doc.exists) {
          let data = doc.data();
          if (data.chats) {
            setChatList(data.chats);
          }
        }
      });
  },
  //pegando o conteudo de um chat
  onChatContent: (chatId, setList, setUsers) => {
    return db
      .collection("chats")
      .doc(chatId)
      .onSnapshot((doc) => { 
        if (doc.exists) {
          let data = doc.data();
          
          setList(data.messages);
          setUsers(data.users);
        }
      });
  },

  sendMessage: async (chatData, userId, type, body, users) => {

    let now = new Date();
    

    db.collection("chats").doc(chatData.chatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({
        type: type,
        author: userId,
        body: body,
        date: now
      })
    });

    console.log(users)

    for(let i in users){
      let u = await db.collection("users").doc(users[i]).get();

      

      let uData = u.data();
      console.log(uData.chats)

      if(uData.chats) {
        let chats = [...uData.chats];

        for(let e in chats){
          if(chats[e].chatId === chatData.chatId) {
            chats[e].lastMessage = body;
            chats[e].lastMessageDate = now;
            console.log(chats)
          }
        }

        await db.collection("users").doc(users[i]).update({
          chats: chats
        })
      }
    }


  },
};
