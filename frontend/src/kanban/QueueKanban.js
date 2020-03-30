import React from "react";
import {
  Board,
  BoardContainer
} from ".";
import Lane from "./Lane";
import { queueWidth } from "./Constants";
import { QueueFooter } from "./QueueFooter";
import { useHistory } from "react-router-dom";
import { KANBAN, TREE } from "../constants/routes";

function QueueKanbanInner(props) {
  const { columns, onColumnChange, withScrollableColumns } = props;
  const history = useHistory();

  const getNewCardStub = (task, type) => {
    var sum = "";
    columns.QueueItems.map((val) => {
      sum = sum + val.id;
      return sum;
    });

    return {
      id: sum,
      title: task,
      type: type
    };
  };

  const addNewTask = (task, type) => {
    const newData = getNewCardStub(task, type);
    let newColumns = {
      QueueItems: [...columns["QueueItems"], newData]
    };
    onColumnChange(newColumns);
  };

  const onCardClick = (id) => {
    const clickedCard = columns.QueueItems.find(element => element.id === id);
    if (!clickedCard) {
      return;
    }

    var currentHistoryState = history.location.state;
    var currentStack = [];
    if (currentHistoryState) {
      currentStack = currentHistoryState.stack;
    }

    currentStack.push(clickedCard.title);

    if (clickedCard.type === "kanban") {
      history.push(KANBAN + "/" + id, { stack: currentStack });
    } else if (clickedCard.type === "nestedTree") {
      history.push(TREE + "/" + id, { stack: currentStack });
    }
  };

  return (
    <BoardContainer>
      <Lane
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
