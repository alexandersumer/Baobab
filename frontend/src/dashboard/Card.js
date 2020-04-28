import { Dropdown, Icon, Menu, message, Popconfirm } from "antd";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../firebase";
import TreeForm from "./TreeForm";
import "./Card.css";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      livestreamSetupVisible: false,
      inviteFlowVisible: false,
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleOk = (e) => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (!firebase.isAuthenticated()) {
        firebase.doSignInAnonymously();
      }

      message.info("Updating Tree...");

      firebase
        .getFunctionsInstance()
        .httpsCallable("UpdateTree")({
          id: this.props.record.id,
          name: form.getFieldValue("Name"),
          description: form.getFieldValue("Description"),
        })
        .then(() => {
          message.success("Updated Tree", 3);
          form.resetFields();
          this.setState({ visible: false });
          this.props.getTreesHook();
        })
        .catch((error) => {
          message.error(
            "Failed to update Tree with error: " + error.message,
            3
          );
        });
    });
  };

  handleCancel = (e) => {
    console.log(e);
    message.error("Tree not updated", 2);
    this.setState({ visible: false });
  };

  handleDeleteConfirm = () => {
    this.props.deleteTree(this.props.record.id);
    firebase
      .getFunctionsInstance()
      .httpsCallable("DeleteTree")({
        treeID: this.props.record.id,
      })
      .then(() => {
        message.success("Tree deleted: " + this.props.record.name, 3);
      })
      .catch((error) => {
        message.error("Failed to delete Tree with error: " + error.message, 3);
      });
  };

  handleDeleteCancel = () => {
    message.info("Tree not deleted", 2);
  };

  menu = () => (
    <Menu>
      <Menu.Item key="1" onClick={this.showModal}>
        Edit
      </Menu.Item>
      <div className="card-divider" />
      <Menu.Item key="5" style={{ backgroundColor: "#ff4d4f", color: "#fff" }}>
        <Popconfirm
          title="Deleting an Tree cannot be undone!"
          onConfirm={this.handleDeleteConfirm}
          onCancel={this.handleDeleteCancel}
          okText="Delete Tree"
          cancelText="Cancel"
        >
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <div>
        <div className="card">
          <Link
            className="card-link"
            to={{
              pathname: "/tree/" + this.props.record.rootNode,
              state: { tree: this.props.record.id },
            }}
          >
            <div className="icon-block">
              <img
                alt={this.props.altText}
                src={this.props.iconPath}
                height="25px"
              />
            </div>
            <div className="info-block">
              <div className="tree-title">
                <h3>{this.props.record.name}</h3>
              </div>
              <div className="card-timestamp">
                <p>{this.props.record.description}</p>
              </div>
            </div>
          </Link>
          <div className="menu-ellipses">
            <Dropdown overlay={this.menu} trigger={["click"]}>
              <Icon type="more" style={{ fontSize: "25px" }} />
            </Dropdown>
            <TreeForm
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              title="Edit Tree"
              okText="Update Tree"
              wrappedComponentRef={this.saveFormRef}
              preFill={this.props.record}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Card);
