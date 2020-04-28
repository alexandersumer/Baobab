/* Tree Index page */
import React from "react";
import { FlowChart } from "@nanway/react-flow-chart";
import { cloneDeep, mapValues } from "lodash";
import * as actions from "@nanway/react-flow-chart/src/container/actions"; // '../src/container/actions'
import { NodeStyles } from "../../nodes/NodeStyling";
import { NodeContent } from "../../nodes/NodeContents";
import { Page } from "../../canvas/Page";

import Modal from "@atlaskit/modal-dialog";
import { ModalTransition } from "@atlaskit/modal-dialog";

// Sidebar related imports
import { DragAndDropSideBar } from "../../sidebar/DragAndDropSideBar";
import firebase from "../../firebase";
import {
  convertToSexyTree,
  linkComplete,
  recursiveDelete,
  deleteLink,
  validateLink,
  onDropCanvas,
} from "./TreeUtils";
import { CanvasOuter } from "../../canvas/CanvasOuter";
import { withRouter } from "react-router";
import { EditModal } from "./EditingUtils";

import { message } from "antd";

import "./Tree.css";
import Animate from "rc-animate";
import loadingTree from "../../img/treee-load.gif";

// Helper import
import Helper from "../../usageHelp/Helper";

class Treee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: {
        x: 0,
        y: 0,
      },
      nodes: {},
      links: {},
      selected: {},
      hovered: {},
      loading: true,
      canvasColour: "#f5f5f5",
      nodeColour: "#fa7c92",
      queueColour: "#6ec4db",
    };

    this.reload = this.reload.bind(this);
    this.setState = this.setState.bind(this);
    this.updatePositions = this.updatePositions.bind(this);
    this.changeColour = this.changeColour.bind(this);
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.updatePositions();
      // Add state update here
      const tokens = location.pathname.split("/");
      if (tokens[1] === "tree") {
        this.reload(tokens[2]);
      }
    });
  }

  updatePositions = () => {
    const positionUpdates = [];
    Object.entries(this.state.nodes).forEach((item) => {
      positionUpdates.push({
        id: item[0],
        x: item[1].position.x,
        y: item[1].position.y,
      });
    });
    return firebase
      .getFunctionsInstance()
      .httpsCallable("UpdateNodePositions")({
        nodes: positionUpdates,
      })
      .then((result) => {
        console.log("Tree positions updated successfully");
      })
      .catch((error) => {
        console.error("Failed to update positions with " + error.message);
      });
    // Send this thicc boi to the backend for a state update
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.updatePositions);
    this.reload(this.props.match.params.parentID);
  }

  componentWillUnmount() {
    this.unlisten();
    window.removeEventListener("beforeunload", this.updatePositions);
  }

  resetChart() {
    return {
      offset: {
        x: 0,
        y: 0,
      },
      nodes: {},
      links: {},
      selected: {},
      hovered: {},
      loading: true,
      canvasColour: this.state.canvasColour,
      nodeColour: this.state.nodeColour,
      queueColour: this.state.queueColour,
    };
  }

  reload(newID, prettify = false) {
    if (!prettify && this.props.authUser) {
      this.updatePositions();
    }
    // Add state update here
    const tmp = this.state;
    tmp.loading = true;
    this.setState(tmp);

    firebase.whenAuthReady().then(() => {
      firebase
        .getFunctionsInstance()
        .httpsCallable("GetTreeNodes")({
          rootNodeID: newID,
        })
        .then((result) => {
          result = result.data;
          const main = result[0];
          if (main.type === "Queue") {
            this.props.history.push("/tree/" + main.partOf);
          } else if (!main.type) {
            this.props.history.push("/kanban/" + newID);
          } else {
            const newChart = cloneDeep(this.resetChart());
            newChart.loading = false;
            this.setState(convertToSexyTree(result, newChart, prettify));
          }
        })
        .catch((e) => {
          if (
            e.message.indexOf("6969") !== -1 ||
            e.message.indexOf("444") !== -1
          ) {
            this.props.history.push("/404");
          } else {
            message.error(
              "Tree load failed. Please refresh the page. Error: " +
                message.error
            );
            console.error(e);
          }
        });
      if (typeof this.props.location.state !== "undefined") {
        firebase
          .getFunctionsInstance()
          .httpsCallable("GetTree")({
            treeID: this.props.location.state.tree,
          })
          .then((result) => {
            console.log(result);
            this.setState({
              canvasColour: result.data.canvasColour,
              nodeColour: result.data.nodeColour,
              queueColour: result.data.queueColour,
            });
          })
          .catch((e) => {
            console.error(e);
          });
      }
    });
  }

  canvasDrop = (toDrop) => {
    const newChart = onDropCanvas(
      this.state,
      this.state.tree,
      this.props.match.params.parentID,
      toDrop,
      this.reload
    );
    this.setState(newChart);
  };

  onLinkComplete = (props) => {
    const newChart = linkComplete(props, this.state, this.reload);
    this.setState(newChart);
  };

  // Do nothing when delete key is pressed
  onDeleteKey = () => {
    // Disable for delete key
    // leave this here
  };

  onDeletePressed = () => {
    const chart = this.state;

    if (chart.selected.type === "node" && chart.selected.id) {
      const node = chart.nodes[chart.selected.id];

      chart.deletePressed = true;
      if (node.properties.type === "Root") {
        chart.deleteMsg =
          "Deleting this node will delete this page and/ or tree. You will be returned to its parent.";
        chart.deleteAction = () => {
          const newChart = chart;
          newChart.deletePressed = false;
          newChart.deleteMsg = "";
          newChart.deleteAction = () => {};
          const history = this.props.history;
          this.setState(newChart);
          const onFinish = () => {
            if (node.properties.parent) {
              history.push("/tree/" + node.properties.parent);
            } else {
              history.push("/dashboard");
            }
          };
          recursiveDelete(
            chart,
            node,
            () => {
              this.reload(this.props.match.params.parentID);
            },
            onFinish
          );
        };
      } else {
        chart.deleteMsg =
          "Deleting this node will delete all of its children as well.";
        chart.deleteAction = () => {
          const newChart = recursiveDelete(chart, node, () => {
            this.reload(this.props.match.params.parentID);
          });
          newChart.deletePressed = false;
          newChart.deleteMsg = "";
          newChart.deleteAction = () => {};
          newChart.selected = {};
          this.setState(newChart);
        };
      }
      this.setState(chart);
    } else if (chart.selected.type === "link" && chart.selected.id) {
      const newChart = deleteLink(this.state, () => {
        this.reload(this.props.match.params.parentID);
      });
      newChart.selected = {};
      this.setState(chart);
    }
  };

  loadCanvasColour = async () => {
    await firebase.whenAuthReady().then(() => {
      firebase
        .getFunctionsInstance()
        .httpsCallable("GetTree")({
          treeID: this.props.location.state.tree,
        })
        .then((result) => {
          console.log(result);
          this.setState({
            canvasColour: result.data.canvasColour,
            nodeColour: result.data.nodeColour,
            queueColour: result.data.queueColour,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    });
  };

  changeColour = (input) => {
    var validInputFlag = 0;
    if (this.state.editPressed === true) {
      if (input.canvasBackground !== undefined && input.nodeBackground !== undefined && input.queueBackground !== undefined){
        validInputFlag = 1;
        this.setState({
          canvasColour: input.canvasBackground,
          nodeColour: input.nodeBackground,
          queueColour: input.queueBackground,
          editPressed: false,
        });
      }

      if (typeof this.props.location.state !== undefined && validInputFlag  === 1) {
        firebase.whenAuthReady().then(() => {
          firebase
            .getFunctionsInstance()
            .httpsCallable("UpdateColour")({
              id: this.props.location.state.tree,
              canvasColour: input.canvasBackground,
              nodeColour: input.nodeBackground,
              queueColour: input.queueBackground,
            })
            .catch((e) => {
              console.error(e);
            });
        });
      }
    }
  };

  // Edit fucntions
  onSidebarEdit = () => {
    let chart = this.state;
    chart.editPressed = true;
    this.setState(chart);
  };

  // Edit modal function
  editClose = () => {
    let chart = this.state;
    chart.editPressed = false;
    this.setState(chart);
  };

  // Delete Modal functions
  close = () => {
    let chart = this.state;
    chart.deletePressed = false;
    chart.deleteMsg = "";
    chart.deleteAction = () => {};
    this.setState(chart);
  };

  // Edit fuctions
  onNameChange = (id, newName) => {
    const chart = this.state;
    chart.nodes[id].properties.description = newName;
    this.setState(chart.nodes[id]);
  };

  render() {
    const chart = this.state;
    actions.onLinkComplete = this.onLinkComplete;
    const stateActions = mapValues(actions, (func) => (...args) => {
      const res = func(...args);
      this.setState(res);
    });

    stateActions.onCanvasDrop = this.canvasDrop;
    stateActions.onDeleteKey = this.onDeleteKey;
    stateActions.onSidebarDelete = this.onDeletePressed;
    stateActions.onSidebarEdit = this.onSidebarEdit;
    stateActions.onDragNodeStop = (xd) => {
      console.log("hehhe");
    };

    // Delete Modal actions
    const modalActions = [
      {
        text: "Delete",
        onClick: this.state.deleteAction,
        appearance: "danger",
      },
      {
        text: "Close",
        onClick: this.close,
        appearance: "warning",
      },
    ];

    if (this.props.authUser) {
      return (
        <div>
          {this.state.loading ? (
            <Page style={{ justifyContent: "center" }}>
              <img src={loadingTree} alt=""></img>
            </Page>
          ) : null}
          <Animate transitionName="fade" transitionLeave={false}>
            {!this.state.loading ? (
              <Page>
                <DragAndDropSideBar
                  onSexify={() => {
                    this.reload(this.props.match.params.parentID, true);
                  }}
                  // add variables
                  selected={chart.selected.type}
                  onSidebarDelete={stateActions.onSidebarDelete}
                  onSidebarEdit={stateActions.onSidebarEdit}
                />
                <FlowChart
                  key="1"
                  chart={chart}
                  config={{
                    smartRouting: true, // Does not work because non most updated drag n drop
                    validateLink: validateLink,
                    onNameChange: this.onNameChange,
                    canvasColour: this.state.canvasColour,
                    nodeColour: this.state.nodeColour, //"#B58D3D"
                    queueColour: this.state.queueColour, //"#F5D300"
                  }}
                  callbacks={stateActions}
                  Components={{
                    NodeInner: NodeContent,
                    Node: NodeStyles,
                    CanvasOuter: CanvasOuter,
                    //Port: PortCustom,
                  }}
                />
              </Page>
            ) : null}
          </Animate>
          {chart.deletePressed && (
            <ModalTransition>
              <Modal
                actions={modalActions}
                onClose={this.close}
                heading={"Warning"}
              >
                {this.state.deleteMsg}
              </Modal>
            </ModalTransition>
          )}
          <ModalTransition>
            {chart.editPressed && (
              <EditModal
                onClose={this.editClose}
                onSave={this.changeColour}
              ></EditModal>
            )}
          </ModalTransition>
          <Helper />
        </div>
      );
    } else {
      return "You need to be logged in";
    }
  }
}

export const Tree = withRouter(Treee);
