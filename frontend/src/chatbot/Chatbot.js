import * as React from "react";
import Window from "./Window";

class Chatbot extends React.Component {
  constructor(props) {
    super(props);

    this.generateReply = this.generateReply.bind(this);
  }

  generateReply(input) {
    let replies = [];
    if (input === "Whomst is thy father?") {
      replies.push("Nanway 'nangway' Chen");
      replies.push("Harry '3rd leg' Brink");
      replies.push("Alex 'leetcode' Jones");
      replies.push("Conrad 'lonely stump' Martin");
      replies.push("Tom 'm a r r y  w a n n a' Ho");
    } else {
      replies.push(input);
    }
    return replies;
  }

  render() {
    return (
      <Window 
        generateReply={this.generateReply}
      /> 
    );
  }
}

export default Chatbot;
