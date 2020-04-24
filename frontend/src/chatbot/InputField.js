import * as React from "react";
import SendButton from "./SendButton";

import "./styles/input-field.css";

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputActive: false,
      inputHasText: false
    };

    this.submitMessage = this.submitMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this.submitMessage(event);
    }
  }

  handleKeyUp() {
    this.setState({ inputHasText: this.input.innerText.length !== 0 });
  }

  isAlphaNumeric(text) {
    for (var i = 0; i < text.length; i++) {
      let ch = text[i];
      if (ch !== " " && ch !== "\t" && ch !== "\n") return true;
    }
    return false;
  }

  submitMessage(event) {
    event.preventDefault();
    let message = this.input ? this.input.innerText.trim() : "";
    if (this.isAlphaNumeric(message)) {
      this.props.handleSubmit({
        isUser: true,
        text: message
      });
    }
    if (this.input) this.input.innerHTML = "";
  }

  render() {
    return (
      <form
        className={
          this.state.inputActive ? "input-field-active" : "input-field-inactive"
        }
      >
        <div
          role="button"
          tabIndex={0}
          onFocus={() => {
            this.setState({ inputActive: true });
          }}
          onBlur={() => {
            this.setState({ inputActive: false });
          }}
          ref={e => {
            this.input = e;
          }}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          contentEditable="true"
          placeholder="Ask me a question!"
          className="input-text"
        />
        <div className="button-section">
          <SendButton onClick={this.submitMessage} />
        </div>
      </form>
    );
  }
}

export default InputField;
