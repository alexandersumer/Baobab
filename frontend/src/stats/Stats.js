import React, { Component } from "react";
import firebase from "../firebase";
import { message, Skeleton } from "antd";
import InProgIcon from "../img/InProg.png";
import CompletedIcon from "../img/Completed.png";
import "./Stats.css";
import { math } from "@atlaskit/theme";
import Tree1 from "../img/TreeGrow1.png";
import Tree2 from "../img/TreeGrow2.png";
import Tree3 from "../img/TreeGrow3.png";
import Tree4 from "../img/TreeGrow4.png";
import Tree5 from "../img/TreeGrow5.png";
import TreeFinal from "../img/TreeGrowFinal.png";
import Tooltip from "react-tooltip-lite";
import "../toolTip/toolTip.css";

class Stats extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { finished: 0, inProg: 0 };
  }

  getAchievement = pct => {
    if (pct < 25) {
      return "You've still got a while to go! Keep pushing!";
    } else if (pct >= 25 && pct < 50) {
      return "Getting there... Dig deeper! Push harder! Move faster! 💪";
    } else if (pct == 50) {
      return "Jonny didn't give up halfway. He finishes what he starts!";
    } else if (pct > 50 && pct < 75) {
      return "Work it a bit deeper, a bit faster, a bit longer and we'll get there!";
    } else if (pct >= 75 && pct <= 90) {
      return "You're almost there, just a little bit longer, ramp it up like Jonny would!";
    } else if (pct > 90 && pct <= 99) {
      return "Yes, yes, yes! Come on! Finish it!";
    } else {
      return "💦 Great finish! Jonny would be proud! 💦";
    }
  };

  getTreeStatus = pct => {
    if (pct < 10) {
      return Tree1;
    } else if (pct < 25) {
      return Tree2;
    } else if (pct < 50) {
      return Tree3;
    } else if (pct < 75) {
      return Tree4;
    } else if (pct < 100) {
      return Tree5;
    } else {
      return TreeFinal;
    }
  };

  countDoneNotDone = data => {
    data = data.data;
    var inProg = 0;
    var finished = 0;
    for (let parent of Object.keys(data.parentChildren)) {
      if (data.parentChildren[parent]["Doing"]) {
        inProg++;
      }

      inProg = inProg + data.parentChildren[parent]["ToDo"].length;
      finished = finished + data.parentChildren[parent]["Done"].length;
    }
    this.setState({ finished: finished, inProg: inProg });
  };

  componentDidMount() {
    firebase.whenAuthReady().then(() => {
      firebase
        .getFunctionsInstance()
        .httpsCallable("SearchKanbanItems")()
        .then(result => {
          this.countDoneNotDone(result);
        })
        .catch(error => {
          message.error(
            "Failed to search kanban items with error: " + error.message,
            3
          );
        });
    });
  }

  render() {
    const finished = this.state.finished;
    const inProg = this.state.inProg;
    const pct = Math.ceil((100 * finished) / (finished + inProg));
    return (
      <div style={{ marginTop: "42px" }}>
        <h1>Your Progress</h1>
        {this.props.loading ? (
          <Skeleton></Skeleton>
        ) : (
          <React.Fragment>
            <ProgItem
              image={CompletedIcon}
              text={"Completed"}
              count={finished}
            ></ProgItem>
            <ProgItem
              image={InProgIcon}
              text={"In Progress"}
              count={inProg}
            ></ProgItem>
            <div className="progBarContainer">
              <div style={{ width: pct + "%" }} className="progBar progBarDone">
                {inProg === 0 ? "100%" : pct + "%"}
              </div>
            </div>
            <div style={{ marginTop: "15px" }} className="centreItems">
              <h2>{this.getAchievement(pct)}</h2>
            </div>
            <Tooltip
              content="Complete more tasks to grow your tree!"
              className="beautifyToolTip"
            >
              <div className="centreItems">
                <img src={this.getTreeStatus(pct)}></img>
              </div>
            </Tooltip>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const ProgItem = props => {
  return (
    <div className="progContainer progWrapper">
      <div className="progWrapper">
        <img className="progIcon" src={props.image}></img>
        <h2 className="progText">{props.text}</h2>
      </div>
      <h2 className="progText">{props.count}</h2>
    </div>
  );
};

export default Stats;
