/* Customizes the internals/contents of a node
 *   (NOT COLOURING)
 */
import * as React from "react";
import { QueueKanban } from "../kanban";
import { QDiv, QTitle, ReadViewContainer } from "./nodeTypes";
import firebase from "../firebase";
import "./Nodes.css";

import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";

// TODO make this take in unique queueData
export const NodeContent = ({ node, config }) => {
  const heading = node.properties.description;

  const getQueueData = () => {
    if (node.notInDB) {
      return Promise.resolve({ QueueItems: [] });
    } else {
      return firebase
        .getFunctionsInstance()
        .httpsCallable("GetQueueItems")({
          queueHeadID: node.id
        })
        .then(result => {
          return result.data;
        })
        .catch(error => {
          console.error(error);
          return { QueueItems: [] };
        });
    }
  };

  const reorderQ = columns => {
    const items = columns.QueueItems.map(item => item.id);
    return firebase
      .getFunctionsInstance()
      .httpsCallable("ReorderQueue")({
        queueID: node.id,
        items: items
      })
      .then(success => {
        console.log("Succesful reorder");
      })
      .catch(error => {
        console.error(error);
      });
  };

  // updating name
  const updateName = (id, name) => {
    config.onNameChange(id, name);
    return firebase
      .getFunctionsInstance()
      .httpsCallable("RenameNode")({
        name: name,
        id: id
      })
      .then(success => {
        console.log("Successful rename");
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (node.properties.custom === "output-only") {
    return (
      <div className="TreeNodeData">
        <InlineEdit
          onClick={e => e.stopPropagation()}
          defaultValue={heading ? heading : "Click to Name"}
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          readView={() => (
            <ReadViewContainer>{heading || "Click to Name"}</ReadViewContainer>
          )}
          onConfirm={value => {
            node.properties.description = value;
            updateName(node.id, value);
          }}
        />
      </div>
    );
  } else if (node.properties.custom === "input-output") {
    return (
      <div className="TreeNodeData">
        <InlineEdit
          onClick={e => e.stopPropagation()}
          defaultValue={heading ? heading : "Click to Name"}
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          readView={() => (
            <ReadViewContainer>{heading || "Click to Name"}</ReadViewContainer>
          )}
          onConfirm={value => {
            node.properties.description = value;
            updateName(node.id, value);
          }}
        />
      </div>
    );
  } else if (node.properties.custom === "input-only") {
    return (
      <QDiv>
        <QTitle>
          <InlineEdit
            onClick={e => e.stopPropagation()}
            defaultValue={heading ? heading : "Click to Name"}
            editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
            readView={() => (
              <ReadViewContainer>
                {heading || "Click to Name"}
              </ReadViewContainer>
            )}
            onConfirm={value => {
              node.properties.description = value;
              updateName(node.id, value);
            }}
          />
        </QTitle>

        <div style={{ position: "relative", top: "-37.5px" }}>
          <QueueKanban
            reorderBoard={reorderQ}
            treeID={node.tree}
            parentID={node.id}
            getData={getQueueData}
            className="shadowrealm"
            initial={{ QueueItems: [] }}
          />
        </div>
      </QDiv>
    );
  } else {
    // just in case
    return <p></p>;
  }
};
