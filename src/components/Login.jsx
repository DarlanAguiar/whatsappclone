import React from "react";
import Api from "../Api";

import "./Login.css";

const Loguin = ({onReceive}) => {
  const handleFacebookLogin = async () => {
    let result = await Api.fbPopup();

    if(result) {

      onReceive(result.user);

    } else {
      alert("Erro ao logar");
    }
  };

  return (
    <div className="login">
      <button onClick={handleFacebookLogin}>Logar com o Facebook</button>
    </div>
  );
};

export default Loguin;
