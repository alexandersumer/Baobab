import * as React from "react";
import { REACT_FLOW_CHART } from "@nanway/react-flow-chart";

import { Sidebar } from "./SideBar";
import { TreeButton, QueueButton, EditButton } from "./SideBarNodes";
import { DeleteButton, BeautifyTreeButton, DeleteButtonNah } from "./SideBarNodes";
import Tooltip from 'react-tooltip-lite';
import '../toolTip/toolTip.css';
import { TreeNode, QueueHead } from "../nodes/nodeTypes";
//import DefaultModal from "./EditModal";

const TreeNodeTool = ({ type, ports, properties }) => {
  return (
    <Tooltip
      content="Drag and drop a tree node."
      direction="right"
      className="treeToolTip"
    >
      <TreeButton
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData(
            REACT_FLOW_CHART,
            JSON.stringify({ type, ports, properties })
          );
        }}
      >
        {type}
      </TreeButton>
    </Tooltip>
  );
};

const QueueNodeTool = ({ type, ports, properties }) => {
  return (
    <Tooltip
      content="Drag and drop a queue node."
      direction="right"
      className="queueToolTip"
    >
      <QueueButton
        className="queue"
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData(
            REACT_FLOW_CHART,
            JSON.stringify({ type, ports, properties })
          );
        }}
      >
        {type}
      </QueueButton>
    </Tooltip>
  );
};

export const DragAndDropSideBar = props => {
  return (
    <Sidebar>
      <TreeNodeTool
        type=""
        ports={{
          port1: {
            id: "port1",
            type: "input"
          },
          port2: {
            id: "port2",
            type: "output"
          }
        }}
        properties={{
          custom: "input-output",
          description: "Click to Name"
        }}
      />
      <QueueNodeTool
        type=""
        ports={{
          port1: {
            id: "port1",
            type: "input",
            properties: {
              custom: "property"
            }
          }
        }}
        properties={{
          description: "Click to Name",
          custom: "input-only"
        }}
      />
      <React.Fragment>
        <Tooltip 
          content="Click to restructure your tree!" 
          direction="right"
          className="beautifyToolTip"
        >
          <BeautifyTreeButton
            onClick={() => {
              props.onSexify();
            }}
          ></BeautifyTreeButton>
        </Tooltip>
      </React.Fragment>
      <React.Fragment>
        <Tooltip 
          content="Click to customise your Canvas" 
          direction="right"
          className="editToolTip">
          <EditButton
            onClick={() => {
              // ADD SHIT HERE TODO 
              props.onSidebarEdit();
            }}
          >
          </EditButton>
        </Tooltip>
      </React.Fragment>

      {props.selected ? (
        <React.Fragment>
          <Tooltip 
            content="Delete currently selected node." 
            direction="right"
            className="deleteToolTip"
          >
            <DeleteButton
              onClick={() => {
                props.onSidebarDelete();
              }}
            ></DeleteButton>
          </Tooltip>
        </React.Fragment>
      ) : 
      <React.Fragment>
        <Tooltip 
          content="Select a node or connection to delete it." 
          direction="right"
          className="noSelectDelete">
          <DeleteButtonNah></DeleteButtonNah>
        </Tooltip>
      </React.Fragment>
      }
    </Sidebar>
  );
};
