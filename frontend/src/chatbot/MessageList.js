import * as React from "react";
import Message from "./Message";

import "./styles/messages.css";

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEnd = null;
  }

  componentDidUpdate() {
    if (!this.messagesEnd) return;
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <div className="chatbot-message-list">
        {this.props.messages.map((message, index) => {
          return <Message message={message} key={index} />;
        })}
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => (this.messagesEnd = el)}
        ></div>
      </div>
    );
  }
}

export default MessageList;
