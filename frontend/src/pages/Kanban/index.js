import React from "react";
import { KanbanBoard } from "../../kanban";
import firebase from "../../firebase";
import { useHistory } from "react-router-dom";

export const Kanban = (props) => {
  const parentID = props.match.params.parentID;
  const initial = {
    ["Doing"]: [],
    ["Done"]: [],
    ["ToDo"]: [],
  };
  const history = useHistory();

  const getData = (dataID = null) => {
    if (!dataID) {
      dataID = parentID;
    }
    return firebase.whenAuthReady().then(() => {
      return firebase
        .getFunctionsInstance()
        .httpsCallable("GetKanbanItems")({
          kanbanID: dataID,
        })
        .then((result) => {
          return result.data;
        })
        .catch((error) => {
          console.error(error);
          if (error.message.indexOf("6969") !== -1) {
            history.push("/404");
          } else if (error.message.indexOf("444") !== -1) {
            history.push("/404");
          } else if (error.message.indexOf("420") !== -1) {
            history.push("/tree/" + dataID);
          } else {
            throw error;
          }
        });
    });
  };

  const reorderBoard = (columns) => {
    const todo = columns.ToDo.map((item) => item.id);
    const doing = columns.Doing.length > 0 ? columns.Doing[0].id : null;
    const done = columns.Done.map((item) => item.id);
    return firebase
      .getFunctionsInstance()
      .httpsCallable("ReorderKanban")({
        kanbanID: parentID,
        toDo: todo,
        doing: doing,
        done: done,
      })
      .then((success) => {
        console.log("Succesful reorder");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return props.authUser ? (
    <KanbanBoard
      parentID={parentID}
      initial={initial}
      getData={getData}
      reorderBoard={reorderBoard}
    />
  ) : (
    "You need to be logged in"
  );
};
