import * as React from "react";
import HelperButton from "./HelperButton";
import "./styles/helper-button.css";

class Helper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      flickityOptions: {
        index: 0,
      },
    };
    this.toggleHelp = this.toggleHelp.bind(this);
  }
  toggleHelp() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    return (
      <HelperButton isOpen={this.state.isOpen} onClick={this.toggleHelp} />
    );
  }
}

export default Helper;
