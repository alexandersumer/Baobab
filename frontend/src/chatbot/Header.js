import * as React from "react";
import botIconUrl from "../img/baobab-tree.svg";

import "./styles/header.css";

class Header extends React.Component {
  render() {
    return (
      <div className="chatbot-header">
        <img className="chatbot-header-img" src={botIconUrl} alt="" />
        <div className="chatbot-header-title"> Baobot </div>
      </div>
    );
  }
}

export default Header;
