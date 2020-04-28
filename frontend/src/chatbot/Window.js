import * as React from "react";
import MessageList from "./MessageList";
import InputField from "./InputField";
import Header from "./Header";

import "./styles/window.css";

class Window extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currMessage: "",
      messages: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMessageToList = this.addMessageToList.bind(this);
  }

  addMessageToList(msg) {
    this.setState((state) => ({
      messages: [...state.messages, msg],
    }));
  }

  async handleSubmit(msg) {
    this.addMessageToList(msg);
    let replyMessages = await this.props.generateReply(msg.text);
    for (var index in replyMessages) {
      let replyText = replyMessages[index];
      let reply = { isUser: false, text: replyText };
      this.addMessageToList(reply);
    }
  }

  render() {
    return (
      <div
        className={
          this.props.isOpen ? "chatbot-window-open" : "chatbot-window-closed"
        }
      >
        <Header />
        <MessageList messages={this.state.messages} />
        <InputField handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default Window;
