import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import "./SearchItem.css";

class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      livestreamSetupVisible: false,
      inviteFlowVisible: false
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  render() {
    return (
      <div>
        <div className="searchItem">
          <Link className="searchItem-link" to={this.props.path}>
            <div className="icon-block">
              <img
                alt={this.props.altText}
                src={this.props.iconPath}
                height="25px"
              />
            </div>
            <div className="info-block">
              <div className="tree-title">
                <h3>{this.props.name}</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(SearchItem);
