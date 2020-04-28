import { Button, message } from "antd";
import React, { Component } from "react";
import QueueAnim from "rc-queue-anim";
import Card from "./Card";
import TreeForm from "./TreeForm";
import firebase from "../firebase";
import Skeleton from "../components/Skeleton";
import "./Dashboard.css";
import Stats from "../stats/Stats";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: true,
      trees: [],
    };
    this.observeAuthChange();
    this.deleteTree = this.deleteTree.bind(this);
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = (e) => {
    const { form } = this.formRef.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      message.info("Creating new tree...");

      await firebase.whenAuthReady();

      firebase
        .getFunctionsInstance()
        .httpsCallable("CreateNewTree")({
          name: form.getFieldValue("Name"),
          description: form.getFieldValue("Description"),
        })
        .then((result) => {
          message.success(
            "Successfully created new tree with name: " + result.data.name,
            3
          );
          form.resetFields();
          this.setState({ visible: false });
          this.getTrees();
        })
        .catch((error) => {
          message.error(
            "Failed to create new tree with error: " + error.message,
            3
          );
        });
    });
  };

  handleCancel = (e) => {
    console.log(e);
    message.error("No tree made", 2);
    this.setState({ visible: false });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  getTrees = async () => {
    await firebase.whenAuthReady();
    firebase
      .getFunctionsInstance()
      .httpsCallable("GetTreeList")()
      .then((result) => {
        this.setState({
          trees: result.data.trees,
          loading: false,
        });
      })
      .catch((error) => {
        message.error("Failed to get trees with error: " + error.message, 3);
      });
  };

  deleteTree(id) {
    this.setState((state) => ({
      trees: state.trees.filter((tree) => !(tree.id === id)),
    }));
  }

  observeAuthChange() {
    firebase.onAuthStateChanged((user) => {
      if (user) this.getTrees();
    });
  }

  render() {
    return (
      <div>
        <div className="parentContainer">
          {this.props.authUser ? (
            <div className="halfWidthContainer">
              <h1>My Trees</h1>
              <br />
              <div>
                <div className="buttonBar">
                  {this.props.authUser && (
                    <Button
                      type="primary"
                      style={{
                        float: "right",
                        backgroundColor: "#59d08f",
                        borderColor: "#59d08f",
                        fontWeight: "bold",
                      }}
                      onClick={this.showModal}
                    >
                      + New Tree
                    </Button>
                  )}
                </div>
                <br />
                <TreeForm
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  title="New Tree"
                  okText="Create Tree"
                  wrappedComponentRef={this.saveFormRef}
                />
              </div>
              {this.state.loading ? (
                <Skeleton />
              ) : (
                <QueueAnim className="trees">
                  {this.state.trees.map((tree) => (
                    <Card
                      key={tree.id}
                      record={tree}
                      altText="active tree"
                      iconPath={require("../img/baobab.png")}
                      getTreesHook={this.getTrees}
                      deleteTree={this.deleteTree}
                    />
                  ))}
                </QueueAnim>
              )}
              {this.state.trees.length < 1 && !this.state.loading && (
                <p className="no-trees">No Trees</p>
              )}

              <Stats loading={this.state.loading}></Stats>
            </div>
          ) : (
            "You need to be logged in to view this page"
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
