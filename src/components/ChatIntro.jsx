import React from 'react';


import telazap from "../img/telazap.png" 

import "./ChatIntro.css";


const ChatIntro = () => {
  return ( 
    <div className='chatIntro'>
      <img src={telazap} alt="imagem chat intordução" />
      <h1>Mantenha seu celular conectado</h1>
      <h2>O WhatsApp conecta ao seu telefone para sincronizar as mensagens<br></br>Para reduzir o uso de dados, conecte seu telefone a uma rede wi-fi.</h2>
    </div>
   );
}
 
export default ChatIntro;