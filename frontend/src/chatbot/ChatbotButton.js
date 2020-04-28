import * as React from "react";
import chatbotIcon from "../img/baobab-tree.svg";
import closeIcon from "../img/minimise-icon.png";

import "./styles/chatbot-button.css";

class ChatbotButton extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.isOpen
            ? "chatbot-toggle-button opened"
            : "chatbot-toggle-button"
        }
        onClick={this.props.onClick}
      >
        <img className={"minimise-chatbot-icon"} src={closeIcon} />
        <div class="tooltip">
          <img className={"open-chatbot-icon"} src={chatbotIcon} />
          {!this.props.isOpen && (
            <span class="tooltiptext"> Talk to Baobot! </span>
          )}
        </div>
      </div>
    );
  }
}

export default ChatbotButton;
