import React, { Component } from "react";
import "./motivation.css";

class MotivationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: this.quoteBuilder()
    };
  }

  getRandomNumber = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  quoteBuilder = () => {
    let quotes = [
      "Don't stop when you're tired, stop when you're done ~ Johnny Sins",
      "Work hard until you no longer have to introduce yourself ~ Johnny Sins",
      "A man stands out for his ability to not give up and fight until the end ~ Johnny Sins",
      "You may love a girl deeply but you can't express it more deeper than 7-8 inches ~ Johnny Sins",
      "I failed some subjects in highschool, but my friend passed all. Now he is the cameraman and I am the star ~ Johnny Sins"
    ];

    let randNum = this.getRandomNumber(5);

    return quotes[randNum];
  };

  render() {
    return <div className="quoteCentral">{this.state.quote}</div>;
  }
}

export default MotivationContainer;
