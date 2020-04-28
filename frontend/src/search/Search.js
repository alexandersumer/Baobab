import React, { Component } from "react";
import { Dropdown, Icon, Menu, message, Form } from "antd";
import QueueAnim from "rc-queue-anim";
import { withRouter } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import SearchItem from "./SearchItem";
import firebase from "../firebase";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

class Search extends Component {
  state = {
    searchWhat: "",
    searchBarText: "",
    filteredItems: [],
    items: [],
    trees: [],
    nodes: [],
    kanbanItems: [],
    loading: true,
  };

  dropdownMenu = () => (
    <Menu>
      <Menu.Item
        onClick={() => {
          this.setState({ searchWhat: "kanbanItems" });
        }}
        key="3"
      >
        Kanban Items
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          this.setState({ searchWhat: "nodes" });
        }}
        key="2"
      >
        Nodes
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          this.setState({ searchWhat: "trees" });
        }}
        key="1"
      >
        Trees
      </Menu.Item>
    </Menu>
  );

  searchKanbanItems = async () => {
    await firebase.whenAuthReady();
    firebase
      .getFunctionsInstance()
      .httpsCallable("SearchKanbanItems")()
      .then((result) => {
        this.setState({
          kanbanItems: result.data.kanbanItems,
          loading: false,
        });
      })
      .catch((error) => {
        message.error(
          "Failed to search kanban items with error: " + error.message,
          3
        );
      });
  };

  searchNodes = async () => {
    await firebase.whenAuthReady();
    firebase
      .getFunctionsInstance()
      .httpsCallable("SearchNodes")()
      .then((result) => {
        this.setState({
          nodes: result.data.nodes,
          loading: false,
        });
      })
      .catch((error) => {
        message.error("Failed to search nodes with error: " + error.message, 3);
      });
  };

  searchTrees = async () => {
    await firebase.whenAuthReady();
    firebase
      .getFunctionsInstance()
      .httpsCallable("SearchTrees")()
      .then((result) => {
        this.setState({
          trees: result.data.trees,
          loading: false,
        });
      })
      .catch((error) => {
        message.error("Failed to search trees with error: " + error.message, 3);
      });
  };

  componentDidMount = () => {
    this.searchKanbanItems();
    this.searchNodes();
    this.searchTrees();
  };

  onChange(event) {
    this.setState({
      searchBarText: event.target.value,
    });
    this.state.filteredItems = this.getResults();
  }

  getResults() {
    if (this.state.searchWhat === "kanbanItems") {
      this.state.items = this.state.kanbanItems;
      return this.state.items.filter((i) =>
        i.title.toLowerCase().includes(this.state.searchBarText.toLowerCase())
      );
    } else if (this.state.searchWhat === "nodes") {
      this.state.items = this.state.nodes;
      return this.state.items.filter((i) =>
        i.name.toLowerCase().includes(this.state.searchBarText.toLowerCase())
      );
    } else if (this.state.searchWhat === "trees") {
      this.state.items = this.state.trees;
      return this.state.items.filter((i) =>
        i.name.toLowerCase().includes(this.state.searchBarText.toLowerCase())
      );
    } else {
      return [];
    }
  }

  render() {
    return (
      <Form className="keyword-form">
        <Dropdown overlay={this.dropdownMenu}>
          <a href="# ">
            Search through...
            <Icon type="down" />
          </a>
        </Dropdown>

        {this.state.searchWhat === "" ? null : (
          <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
            <TextField
              style={{ width: "600px" }}
              type="search"
              margin="normal"
              value={this.state.searchBarText}
              onChange={this.onChange.bind(this)}
            />
          </Box>
        )}

        {this.state.searchWhat === "" ||
        this.state.searchWhat !== "kanbanItems" ? null : this.state
            .searchWhat === "kanbanItems" &&
          this.state.searchBarText !== "" &&
          !this.state.loading ? (
          <QueueAnim className="kanbanItems">
            {this.state.filteredItems.map((i) => (
              <SearchItem
                name={i.title}
                path={"/kanban/".concat(i.parent)}
                iconPath={require("../img/baobab.png")}
              />
            ))}
          </QueueAnim>
        ) : this.state.searchWhat === "kanbanItems" && !this.state.loading ? (
          <QueueAnim className="kanbanItems">
            {this.state.kanbanItems.map((i) => (
              <SearchItem
                name={i.title}
                path={"/kanban/".concat(i.parent)}
                iconPath={require("../img/baobab.png")}
              />
            ))}
          </QueueAnim>
        ) : (
          <Skeleton />
        )}

        {this.state.searchWhat === "" ||
        this.state.searchWhat !== "nodes" ? null : this.state.searchWhat ===
            "nodes" &&
          this.state.searchBarText !== "" &&
          !this.state.loading ? (
          <QueueAnim className="nodes">
            {this.state.filteredItems.map((i) => (
              <SearchItem
                name={i.name}
                path={"/tree/".concat(i.partOf)}
                iconPath={require("../img/baobab.png")}
              />
            ))}
          </QueueAnim>
        ) : this.state.searchWhat === "nodes" && !this.state.loading ? (
          <QueueAnim className="nodes">
            {this.state.nodes.map((i) => (
              <SearchItem
                name={i.name}
                path={"/tree/".concat(i.partOf)}
                iconPath={require("../img/baobab.png")}
              />
            ))}
          </QueueAnim>
        ) : (
          <Skeleton />
        )}

        {this.state.searchWhat === "" ||
        this.state.searchWhat !== "trees" ? null : this.state.searchWhat ===
            "trees" &&
          this.state.searchBarText !== "" &&
          !this.state.loading ? (
          <QueueAnim className="trees">
            {this.state.filteredItems.map((i) => (
              <SearchItem
                name={i.name}
                path={"/tree/".concat(i.rootNode)}
                iconPath={require("../img/baobab.png")}
              />
            ))}
          </QueueAnim>
        ) : this.state.searchWhat === "trees" && !this.state.loading ? (
          <QueueAnim className="trees">
            {this.state.trees.map((i) => (
              <SearchItem
                name={i.name}
                path={"/tree/".concat(i.rootNode)}
                iconPath={require("../img/baobab.png")}
              />
            ))}
          </QueueAnim>
        ) : (
          <Skeleton />
        )}
      </Form>
    );
  }
}

export default withRouter(Search);
