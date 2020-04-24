import React from "react";
import { Board, BoardContainer } from ".";
import Lane from "./Lane";
import { queueWidth, kanbanType, nestedTree } from "./Constants";
import { QueueFooter } from "./QueueFooter";
import { useHistory } from "react-router-dom";
import { KANBAN, TREE } from "../constants/routes";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { message } from "antd";

function QueueKanbanInner(props) {
  const {
    columns,
    onColumnChange,
    withScrollableColumns,
    parentID,
    treeID,
    loading
  } = props;

  const history = useHistory();

  const addNewTask = (task, type) => {
    var node = {
      id: uuidv4(),
      title: task,
      type: type,
      queueID: parentID,
      tree: treeID
    };

    let newColumns = {
      QueueItems: [...columns["QueueItems"], node]
    };

    const key = "mkey";
    message.loading({ content: "Creating...", key });

    firebase
      .getFunctionsInstance()
      .httpsCallable("CreateQueueItem")(node)
      .then(() => {
        onColumnChange(newColumns, true);
        message.success({ content: "Created!", key, duration: 0.5 });
        console.log("Success");
      })
      .catch(error => {
        console.error(error);
        console.log("Not success :( ");
        message.error("Couldn't create queue item: " + error.mesage);
        props.reload();
      });
  };

  const onCardClick = id => {
    const clickedCard = columns.QueueItems.find(element => element.id === id);
    if (!clickedCard) {
      return;
    }

    var currentHistoryState = history.location.state;
    var currentStack = [];
    if (currentHistoryState && currentHistoryState.stack) {
      currentStack = currentHistoryState.stack;
    } else {
      currentHistoryState = {};
    }

    currentStack.push(clickedCard.title);
    currentHistoryState.stack = currentStack;

    if (clickedCard.type === kanbanType) {
      history.push(KANBAN + "/" + id, currentHistoryState);
    } else if (clickedCard.type === nestedTree) {
      history.push(TREE + "/" + id, currentHistoryState);
    }
  };

  return (
    <BoardContainer style={{ minHeight: "max-content" }}>
      <Lane
        loading={loading}
        style={{ width: queueWidth }}
        key={"QueueItems"}
        listId={"QueueItems"}
        cards={columns.QueueItems}
        internalScroll={withScrollableColumns}
        onCardClick={onCardClick}
        footer={
          <QueueFooter
            onAdd={(str, type) => {
              addNewTask(str, type);
            }}
          ></QueueFooter>
        }
      />
    </BoardContainer>
  );
}

export function QueueKanban(props) {
  return (
    <Board
      {...props}
      ControlledBoard={e => {
        return QueueKanbanInner(e);
      }}
    ></Board>
  );
}
