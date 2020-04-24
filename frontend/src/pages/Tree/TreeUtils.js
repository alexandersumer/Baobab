import firebase from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { message } from "antd";

// Edit Modal imports
import Modal from "@atlaskit/modal-dialog";
import styled from "styled-components";


export const convertToSexyTree = (backendData, chart, sexify) => {
  // Given a node and a final structure to use
  // Get the node's children, add to tree, connect to node
  // Repeat for each node
  const main = backendData[0];
  const disconnected = backendData[1];

  main.type = "Root";
  chart.tree = main.tree;
  var width = sexyRecursion(main, chart, 500, 0, main.treeHasErrors, sexify);

  disconnected.forEach(component => {
    width = sexyRecursion(
      component,
      chart,
      width + 50,
      0,
      component.treeHasErrors,
      sexify
    );
  });

  return chart;
};

const getTypeConstants = type => {
  if (type === "Queue") {
    return [
      {
        port1: {
          id: "port1",
          type: "input"
        }
      },
      "input-only",
      null
    ];
  } else if (type === "HighLevel") {
    return [
      {
        port1: {
          id: "port1",
          type: "input"
        },
        port2: {
          id: "port2",
          type: "output"
        }
      },
      "input-output",
      "port2"
    ];
  } else {
    return [
      {
        port1: {
          id: "port1",
          type: "output"
        }
      },
      "output-only",
      "port1"
    ];
  }
};

// Returns width of node's children
const sexyRecursion = (node, chart, prevPosX, prevPosY, errors, sexify) => {
  if (errors) {
    node.children = node.children.filter(el => el != null);
  }

  // Add node to chart
  const nodeConstants = getTypeConstants(node.type);
  chart.nodes[node.id] = {
    id: node.id,
    type: "",
    properties: {
      description: node.name,
      custom: nodeConstants[1],
      parent: node.parent,
      type: node.type
    },
    position: {
      y: sexify ? prevPosY + 80 : node.y,
      x: !sexify ? node.x : 0
    },
    ports: nodeConstants[0],
    tree: node.tree
  };

  var xpos = prevPosX;

  if (!node.children || node.children.length === 0) {
    if (sexify) {
      chart.nodes[node.id].position.x = xpos;
    }
    return xpos + 200;
  }

  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];

    // Connect parent to child
    var link = {
      id: node.id + child.id,
      from: {
        nodeId: node.id,
        portId: nodeConstants[2]
      },
      to: {
        nodeId: child.id,
        portId: "port1"
      }
    };
    chart.links[link.id] = link;

    // Recurse for child
    xpos = sexyRecursion(child, chart, xpos, prevPosY + 100, errors, sexify);
  }

  // Put it in the middle
  if (sexify) {
    var leftMostChild = chart.nodes[node.children[0].id].position.x;
    var rightMostChild =
      chart.nodes[node.children[node.children.length - 1].id].position.x;
    chart.nodes[node.id].position.x = Math.floor(
      (leftMostChild + rightMostChild) / 2
    );
  }
  // return right most lowest
  return xpos;
};

const getParentChild = (nodeA, nodeB, portA, portB) => {
  if (
    nodeA.properties.custom === "output-only" ||
    nodeB.properties.custom === "output-only"
  ) {
    return nodeA.properties.custom === "output-only"
      ? { parent: nodeA, child: nodeB, parentPort: portA, childPort: portB }
      : { parent: nodeB, child: nodeA, parentPort: portB, childPort: portA };
  } else if (
    nodeA.properties.custom === "input-only" ||
    nodeB.properties.custom === "input-only"
  ) {
    return nodeB.properties.custom === "input-only"
      ? { parent: nodeA, child: nodeB, parentPort: portA, childPort: portB }
      : { parent: nodeB, child: nodeA, parentPort: portB, childPort: portA };
  } else {
    // they're both input - output, in this case, parent is port ID 2, child is port ID 1
    if (portA === "port1") {
      return {
        parent: nodeB,
        child: nodeA,
        parentPort: portB,
        childPort: portA
      };
    } else {
      return {
        parent: nodeA,
        child: nodeB,
        parentPort: portA,
        childPort: portB
      };
    }
  }
};

export const recursiveDelete = (chart, node, reload, onFinish) => {
  const deleted = {};
  const toDelete = chart.selected.id;
  if (node.properties.type === "Root") {
    chart = {
      offset: {
        x: 0,
        y: 0
      },
      nodes: {},
      links: {},
      selected: {},
      hovered: {},
      loading: true
    };
  } else {
    const deletionQueue = [node.id];
    while (deletionQueue.length > 0) {
      const head = deletionQueue.shift();
      // Delete the connected links and add those nodes to the queue
      Object.keys(chart.links).forEach(linkId => {
        const link = chart.links[linkId];
        var nextDelete;

        if (link.from.nodeId === head) {
          nextDelete = link.to.nodeId;
          delete chart.links[link.id];
        } else if (link.to.nodeId === head) {
          nextDelete = link.from.nodeId;
          delete chart.links[link.id];
        } else {
          return;
        }

        if (deleted[nextDelete]) {
          return;
        } else if (head === node.id) {
          const parentChild = getParentChild(
            chart.nodes[link.from.nodeId],
            chart.nodes[link.to.nodeId],
            link.from.portId,
            link.to.portId
          );

          if (parentChild.parent.id !== head) {
            return;
          }
        }
        deletionQueue.push(nextDelete);
      });
      deleted[head] = true;
      delete chart.nodes[head];
    }
    // Delete the node
    delete chart.nodes[chart.selected.id];
  }

  message.info("Deleting...");

  firebase
    .getFunctionsInstance()
    .httpsCallable("DeleteNode")({
      nodeID: toDelete
    })
    .then(data => {
      console.log(data);
      console.log("Deleted node and all children");
      if (onFinish) {
        onFinish();
      }
    })
    .catch(error => {
      console.log("Deletion of " + chart.selected.id + " failed");
      message.error(
        "Deletion of " + chart.selected.id + " failed. Error: " + error.message
      );
      console.error(error);
      reload();
    });

  return chart;
};

export const deleteLink = (chart, reload) => {
  const link = chart.links[chart.selected.id];
  const parentChild = getParentChild(
    chart.nodes[link.from.nodeId],
    chart.nodes[link.to.nodeId],
    link.from.portId,
    link.to.portId
  );

  delete chart.links[chart.selected.id];

  firebase
    .getFunctionsInstance()
    .httpsCallable("DeleteConnection")({
      parentID: parentChild.parent.id,
      childID: parentChild.child.id
    })
    .then(() => {
      console.log("Deleted node/ link and all children");
    })
    .catch(error => {
      message.error(
        "Reloading. Deletion of link failed. Error: " + error.message
      );
      console.error(error);
      reload();
    });

  return chart;
};

export const validateLink = ({
  linkId,
  fromNodeId,
  fromPortId,
  toNodeId,
  toPortId,
  chart
}) => {
  // Can't connect input/ input or output/ output
  if (
    chart.nodes[fromNodeId].ports[fromPortId].type ===
    chart.nodes[toNodeId].ports[toPortId].type
  ) {
    return false;
  }

  // The element who is the input can never ever appear in the links
  var input;

  if (chart.nodes[toNodeId].ports[toPortId].type === "input") {
    input = { nodeId: toNodeId, portId: toPortId };
  } else {
    input = { nodeId: fromNodeId, portId: fromPortId };
  }

  for (let edge in chart.links) {
    if (
      (chart.links[edge].from.nodeId === input.nodeId &&
        chart.links[edge].from.portId === input.portId) ||
      (chart.links[edge].to.nodeId === input.nodeId &&
        chart.links[edge].to.portId === input.portId)
    ) {
      return false;
    }
  }
  return true;
};

export const onDropCanvas = (chart, tree, root, toDrop, reload) => {
  const id = uuidv4();
  const node = {
    id: id,
    type: toDrop.data.type,
    ports: toDrop.data.ports,
    properties: toDrop.data.properties,
    position: toDrop.position,
    notInDB: true,
    tree: tree
  };

  var nodeType;
  if (toDrop.data.properties.custom === "input-output") {
    nodeType = "HighLevel";
  } else {
    nodeType = "Queue";
  }

  chart.nodes[id] = node;

  firebase
    .getFunctionsInstance()
    .httpsCallable("CreateNewNode")({
      id: id,
      partOf: root,
      tree: tree,
      type: nodeType,
      name: toDrop.data.properties.description,
      x: node.position.x,
      y: node.position.y
    })
    .then(result => {
      console.log("Successfully created a new node");
    })
    .catch(error => {
      console.error(error);
      message.error("Creation failed. Reloading. Error: " + error.message);
      reload(root);
    });
  return chart;
};

export const linkComplete = (props, chart, reload) => {
  const {
    linkId,
    fromNodeId,
    fromPortId,
    toNodeId,
    toPortId,
    config = {}
  } = props;

  if (
    !config.readonly &&
    (config.validateLink ? config.validateLink({ ...props, chart }) : true) &&
    [fromNodeId, fromPortId].join() !== [toNodeId, toPortId].join()
  ) {
    chart.links[linkId].to = {
      nodeId: toNodeId,
      portId: toPortId
    };

    const { parent, child } = getParentChild(
      chart.nodes[fromNodeId],
      chart.nodes[toNodeId],
      fromPortId,
      toPortId
    );

    firebase
      .getFunctionsInstance()
      .httpsCallable("AddConnection")({
        parent: parent.id,
        child: child.id
      })
      .then(() => {
        console.log("Updated links on backend");
      })
      .catch(error => {
        message.error(
          "Backend update failed due to network delay. Reloading. Error: " +
            error.message
        );
        console.error(error);
        setTimeout(() => {
          reload();
        }, 2000);
      });
  } else {
    delete chart.links[linkId];
  }
  return chart;
};
