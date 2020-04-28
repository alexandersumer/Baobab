import { Button, Dropdown, Icon, Menu, Modal, message } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";
import Search from "../search/Search";
import SignIn from "../auth/SignIn";
import { NavigationStack } from "./NavigationStack";
import "./Header.css";
import WeatherApplication from "../weatherAPI/WeatherAPIBox";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeModalVisible: false,
      signInModalVisible: false,
      helpModalVisible: false,
      flickityOptions: {
        initialIndex: 0,
      },
    };
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.history.push("/");
    //TODO: actually check they logged out successfully.
    firebase.doSignOut();
    message.success("Logged out successfully.");
  }

  setTreeModalVisible(treeModalVisible) {
    this.setState({ treeModalVisible });
  }

  setSignInModalVisible(signInModalVisible) {
    this.setState({ signInModalVisible });
  }

  setHelpModalVisible(helpModalVisible) {
    this.setState({ helpModalVisible: helpModalVisible });
  }

  dropdownMenu = () => (
    <Menu>
      <Menu.Item key="1">
        <Link to="/dashboard">My Trees</Link>
      </Menu.Item>
      <Menu.Item onClick={this.signOut} key="2">
        Sign Out
      </Menu.Item>
    </Menu>
  );

  shouldHaveNav = () => {
    const tokens = this.props.match.url.split("/");
    return (
      this.props.authUser &&
      tokens.find((val) => val === "tree" || val === "kanban")
    );
  };

  getPageID = () => {
    const tokens = this.props.match.url.split("/");
    return tokens[tokens.length - 1];
  };

  render() {
    return (
      <div className="header-wrap sticky">
        <div className="logoWrap">
          <div className="logo">
            <Link to="/">
              <img alt="logo" src={require("../img/logo.svg")} />
            </Link>
          </div>
          {this.shouldHaveNav() && (
            <NavigationStack
              onNavigate={(path) => {
                this.props.history.push(path);
              }}
              pageID={this.getPageID()}
            ></NavigationStack>
          )}
        </div>
        {/* <WeatherApplication></WeatherApplication> */}
        <div className="rhs-buttons">
          <button
            className="searchButton"
            onClick={() => this.setTreeModalVisible(true)}
            size={"large"}
          ></button>
          <Modal
            title="Search"
            style={{ top: 20 }}
            visible={this.state.treeModalVisible}
            onOk={() => this.setTreeModalVisible(false)}
            onCancel={() => this.setTreeModalVisible(false)}
            footer={null}
          >
            <Search doClose={() => this.setTreeModalVisible(false)} />
          </Modal>

          <Modal
            title="Sign In or Register"
            style={{ top: 20 }}
            visible={this.state.signInModalVisible}
            onOk={() => this.setSignInModalVisible(false)}
            onCancel={() => this.setSignInModalVisible(false)}
            footer={null}
          >
            <SignIn
              signInSuccessCallback={() => this.setSignInModalVisible(false)}
              redirect={true}
            />
          </Modal>
          {!this.props.authUser && (
            <Button
              size={"large"}
              onClick={() => this.setSignInModalVisible(true)}
            >
              Sign In
            </Button>
          )}
          {this.props.authUser && (
            <div className="logged-in">
              <Dropdown overlay={this.dropdownMenu}>
                <a href="# ">
                  <Icon type="user" />
                  {this.props.authUser && this.props.displayName}
                  <Icon type="down" />
                </a>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
