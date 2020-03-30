import React from "react";
import { KanbanBoard } from "../../kanban";

const boardData = {
  ["Doing"]: [
    {
      id: "1",
      title: "ligma"
    }
  ],
  ["ToDo"]: [
    {
      id: "4",
      title: "hello1"
    },
    {
      id: "2",
      title: "trello"
    },
    {
      id: "3",
      title: "hehe xd me"
    }
  ],
  ["Done"]: [
    {
      id: "5",
      title: "trello1"
    },
    {
      id: "6",
      title: " me1"
    }
  ]
};

export const Kanban = (props) => {
  const parentID = props.match.params.parentID;
  const initial = {
    ["Doing"]: [],
    ["Done"]: [],
    ["ToDo"]: []
  };

  const getData = () => {
    return boardData;
  };

  return (
    <KanbanBoard parentID={parentID} initial={initial} getData={getData} />
  );
};
