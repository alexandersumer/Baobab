import * as React from "react";
import MessageList from "./MessageList";
import "./chatbotstyles.css";
import InputField from "./InputField";
import Header from "./Header"

class Window extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currMessage : "",
      messages : []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMessageToList = this.addMessageToList.bind(this);
  }

  addMessageToList(msg) {
    this.setState(state => ({
      messages: [...state.messages, msg]
    }));
  }

  async handleSubmit(msg) {
    this.addMessageToList(msg);
    let replyMessages = this.props.generateReply(msg.text);
    for (var index in replyMessages) {
      let replyText = replyMessages[index]
      let reply = {"isUser": false, "text": replyText};
      await new Promise(r => setTimeout(r, 400));
      this.addMessageToList(reply);
    }
    console.log(this.state.messages.length);
  }

  render () {
    return (

      <div className="chatbot-window">
        <Header/>
        <MessageList
          messages={this.state.messages}
        />
        <InputField
          handleSubmit={this.handleSubmit}
        />
      </div>

    );
  }
}

export default Window;