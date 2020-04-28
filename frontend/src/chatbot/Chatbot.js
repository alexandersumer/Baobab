import * as React from "react";
import Window from "./Window";
import ChatbotButton from "./ChatbotButton";

import firebase from "../firebase";

class Chatbot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.generateReply = this.generateReply.bind(this);
    this.toggleChatbot = this.toggleChatbot.bind(this);
  }

  toggleChatbot() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  async generateReply(input) {
    let replies = [];
    if (input === "Whomst is thy father?") {
      replies.push("Nanway 'nangway' Chen");
      replies.push("Harry '3rd leg' Brink");
      replies.push("Alex 'leetcode' Jones");
      replies.push("Conrad 'lonely stump' Martin");
      replies.push("Tom 'm a r r y  w a n n a' Ho");
      return replies;
    }

    if (input === "ligma please!") {
      replies.push("As you wish, Comrade Nanway.");
      return replies;
    }

    if (input === "i've cum 4 a slither") {
      replies.push("http://slither.io/");
      return replies;
    }

    let chatbotInput = {
      input: input,
    };

    await firebase
      .getFunctionsInstance()
      .httpsCallable("GenerateChatbotMessage")(chatbotInput)
      .then((value) => {
        console.log(value.data);
        replies.push(value.data);
      })
      .catch((error) => {
        console.error(error);
      });

    return replies;
  }

  render() {
    return (
      <div>
        <ChatbotButton
          isOpen={this.state.isOpen}
          onClick={this.toggleChatbot}
        />
        <Window generateReply={this.generateReply} isOpen={this.state.isOpen} />
        ;
      </div>
    );
  }
}

export default Chatbot;
