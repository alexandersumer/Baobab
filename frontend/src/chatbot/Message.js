import * as React from "react";
import botIconUrl from "../img/baobab-tree.svg";

import "./styles/messages.css";

class Message extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.message.isUser
            ? "chatbot-user-message"
            : "chatbot-bot-message"
        }
      >
        <div
          className="message-icon"
          style={{
            backgroundImage: `url(${botIconUrl})`,
          }}
        ></div>
        <div className="message-text">{this.props.message.text}</div>
      </div>
    );
  }
}

export default Message;
