import React, { useState } from "react";
import { CardContainer, CardContent, CardFooter } from "./CardCommon";
import KanbanIcon from "../img/kanban-icon.png";
import NestedTreeIcon from "../img/nested-subtree.png";
import { ReactComponent as KanbanCancelIcon } from "../img/kanban-cancel.svg";
import { ReactComponent as KanbanOkIcon } from "../img/kanban-ok.svg";
import { color, borderRadius, nestedTree, kanbanType } from "./Constants";
import Tooltip from "react-tooltip-lite";
import "../toolTip/toolTip.css";

export const clickableButton = (img, clickCallBack) => {
  return (
    <img
      style={{ height: "35px", width: "35px" }}
      alt="Create a node"
      src={img}
      onClick={e => {
        e.stopPropagation();
        clickCallBack();
      }}
      onMouseUp={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    />
  );
};

export function QueueFooter(props) {
  const [taskType, setTask] = useState("normal");
  const [taskName, setTaskName] = useState("");
  const { onAdd } = props;

  const onAddText = text => {
    if (text.length > 0) {
      setTaskName(text);
    }
  };

  const onClickConfirm = () => {
    if (taskName.length > 0) {
      onAdd(taskName, taskType);
    }
    setTask("normal");
  };

  switch (taskType) {
    case "normal": {
      return (
        <CardFooter
          style={{
            backgroundColor: color.QUEUE_ICON_BG,
            borderRadius: borderRadius,
            marginBottom: "10px"
          }}
        >
          <Tooltip content="Create Kanban Board" direction="down">
            <div className="KanbanPNGButton">
              {clickableButton(KanbanIcon, () => {
                setTask(kanbanType);
              })}
            </div>
          </Tooltip>
          <Tooltip content="Create nested Tree" direction="down">
            <div className="KanbanPNGButton">
              {clickableButton(NestedTreeIcon, () => {
                setTask(nestedTree);
              })}
            </div>
          </Tooltip>
        </CardFooter>
      );
    }
    default: {
      const title = taskType === kanbanType ? "Board Name?" : "Tree name?";
      const cardColor =
        taskType === kanbanType ? color.QUEUE_KANBAN : color.QUEUE_NESTED;

      return (
        <div>
          <CardContainer color={cardColor} className="CardNoHover">
            <CardContent>
              <p style={{ color: "white" }}>
                <b>{title}</b>
              </p>
              <input
                style={{ margin: "1.69px" }}
                ref={input => input && input.focus()}
                className="shadowrealm"
                onChange={event => {
                  onAddText(event.target.value);
                }}
                onClick={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onKeyDown={e => {
                  e.stopPropagation();
                  if (e.keyCode === 13) {
                    onClickConfirm();
                  }
                }}
              ></input>
            </CardContent>
          </CardContainer>
          <CardFooter>
            <KanbanOkIcon
              className="KanbanButton"
              onClick={e => {
                e.stopPropagation();
                onClickConfirm();
              }}
              onMouseUp={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            ></KanbanOkIcon>
            <KanbanCancelIcon
              className="KanbanButton"
              onClick={e => {
                e.stopPropagation();
                setTask("normal");
              }}
              onMouseUp={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            ></KanbanCancelIcon>
          </CardFooter>
        </div>
      );
    }
  }
}
