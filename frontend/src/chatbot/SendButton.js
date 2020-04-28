import * as React from "react";

import "./styles/send-button.css";

class SendButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick} className="send-button-container">
        <svg
          version="1.1"
          className="send-button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 96 96"
          enableBackground="new 0 0 37.393 37.393"
        >
          <g id="XMLID_2_">
            <polygon
              id="XMLID_4_"
              points="15,10 22,40 60,48 22,56 15,86 86,48 	"
            />
          </g>
        </svg>
      </button>
    );
  }
}

export default SendButton;
