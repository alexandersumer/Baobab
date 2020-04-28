import React, { useState } from "react";

import { Board, BoardContainer } from ".";
import { Popconfirm } from "antd";
import Lane from "./Lane";
import { DoingTitle, Title } from "./Title";
import { doingWidth, color } from "./Constants";
import { AddCardFooter } from "./AddCardFooter";
import styled from "styled-components";
import { ModalTransition } from "@atlaskit/modal-dialog";
import { KanbanModal } from "./KanbanModal";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as KanbanCancelIcon } from "../img/kanban-cancel.svg";
import { useHistory } from "react-router-dom";
import { message } from "antd";

import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";
import { ReadViewContainer } from "../nodes/nodeTypes";
import { Grid, GridColumn } from "@atlaskit/page";

import firebase from "../firebase";

const ParentContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${color.KANBANBG};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export function KanbanBoard(props) {
  return (
    <Board
      {...props}
      ControlledBoard={(e) => {
        return KanbanBoardInner(e);
      }}
    ></Board>
  );
}

function KanbanBoardInner(props) {
  const {
    columns,
    onColumnChange,
    withScrollableColumns,
    parentID,
    treeID,
    loading,
  } = props;
  console.log(loading);
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");

  const onClose = () => {
    setOpen(false);
  };
  const history = useHistory();

  const onCardClick = (id) => {
    setSelectedCard(id);
    setOpen(true);
  };

  const determineDropDisabled = () => {
    if (columns["Doing"].length >= 1) {
      return true;
    } else {
      return false;
    }
  };

  const findCard = (id) => {
    var foundArr = [
      columns["ToDo"].findIndex((card) => {
        return card.id === id;
      }),
      columns.Doing.findIndex((card) => {
        return card.id === id;
      }),
      columns.Done.findIndex((card) => {
        return card.id === id;
      }),
    ];

    const found = foundArr.findIndex((element) => {
      return element !== -1;
    });
    if (found < 0) {
      console.error("Couldn't find card with id: " + id);
    }

    var cols = ["ToDo", "Doing", "Done"];
    return {
      card: columns[cols[found]][foundArr[found]],
      board: cols[found],
      indexInArray: foundArr[found],
    };
  };

  const addNewTask = (task) => {
    var card = {
      id: uuidv4(),
      title: task,
      description: "",
      tree: treeID,
    };

    const newColumns = {
      ...columns,
      ["ToDo"]: [...columns["ToDo"], card],
    };

    const key = "mkey";
    message.loading({ content: "Creating...", key });

    firebase
      .getFunctionsInstance()
      .httpsCallable("CreateKanbanItem")({
        id: card.id,
        title: task,
        kanbanID: parentID,
        tree: treeID,
      })
      .then(() => {
        onColumnChange(newColumns, true);
        message.success({ content: "Created!", key, duration: 0.5 });
        console.log("Successfully added new task ");
      })
      .catch((error) => {
        console.error(error);
        message.error("Couldn't add new task: " + error.mesage);
        props.reload();
      });
  };

  const onCardChange = (card) => {
    const changedCard = findCard(card.id);
    columns[changedCard.board][changedCard.indexInArray] = card;
    onColumnChange(columns);

    return firebase
      .getFunctionsInstance()
      .httpsCallable("ModifyKanbanItem")({
        itemID: card.id,
        title: card.title,
        description: card.description ? card.description : "",
      })
      .then((result) => {
        console.log("Great Success in updating " + card.id);
      })
      .catch((error) => {
        message.error("Couldn't modify item: " + error.mesage);
        console.log("Not Great Sucess");
      });
  };

  const onCardDelete = (id) => {
    setOpen(false);
    setSelectedCard("");
    const changedCard = findCard(id);
    columns[changedCard.board].splice(changedCard.indexInArray, 1);

    return firebase
      .getFunctionsInstance()
      .httpsCallable("DeleteKanbanItem")({
        itemID: id,
      })
      .then((result) => {
        console.log("Great Success in deleting " + id);
        onColumnChange(columns, true);
      })
      .catch((error) => {
        console.log("Not Great Delete");
        message.error("Reloading. Couldn't add delete task: " + error.mesage);
        props.reload();
      });
  };

  const onBoardDelete = () => {
    message.info("Deleting...");
    firebase
      .getFunctionsInstance()
      .httpsCallable("DeleteNode")({
        nodeID: parentID,
      })
      .then((data) => {
        console.log(data);
        history.push("/tree/" + data.data.navigateTo);
      })
      .catch((error) => {
        console.error(error);
        console.log("Not success :( ");
        message.error("Couldn't delete board: " + error.mesage);
      });
  };

  var propsName = props.name;

  const onBoardNameChange = (id, name) => {
    propsName = name;
    return firebase
      .getFunctionsInstance()
      .httpsCallable("RenameNode")({
        name: name,
        id: id,
      })
      .then((success) => {
        console.log("Successful rename of Kanban");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseLine",
        }}
      >
        <Grid>
          <GridColumn medium={3}></GridColumn>
          <GridColumn medium={20}>
            <DoingTitle
              style={{
                width: "535px",
              }}
            >
              <InlineEdit
                onClick={(e) => e.stopPropagation()}
                defaultValue={propsName ? propsName : "Click to Name"}
                editView={(fieldProps) => (
                  <Textfield {...fieldProps} autoFocus />
                )}
                readView={() => (
                  <ReadViewContainer>
                    {propsName || "Click to Name"}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  propsName = value;
                  onBoardNameChange(parentID, propsName);
                }}
              />
            </DoingTitle>
          </GridColumn>
          <GridColumn medium={3}></GridColumn>
        </Grid>
      </div>
      <ModalTransition>
        {open && (
          <KanbanModal
            autoFocus={false}
            onClose={onClose}
            card={findCard(selectedCard).card || { id: "", title: "" }}
            onDelete={onCardDelete}
            onChange={onCardChange}
          />
        )}
      </ModalTransition>
      <ParentContainer>
        <BoardContainer style={{ minHeight: "auto" }}>
          <Lane
            loading={loading}
            key={"Doing"}
            header={
              <div style={{ display: "flex" }}>
                <DoingTitle>{"Doing"}</DoingTitle>

                <Popconfirm
                  title="Delete kanban and all it's items?"
                  onConfirm={() => {
                    onBoardDelete();
                  }}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <KanbanCancelIcon className="KanbanDeleteButton" />
                </Popconfirm>
              </div>
            }
            listId={"Doing"}
            cards={columns.Doing}
            isDropDisabled={determineDropDisabled()}
            style={{ width: doingWidth }}
            onCardClick={onCardClick}
          />
        </BoardContainer>
        <BoardContainer>
          <Lane
            loading={loading}
            className="NormalLane"
            key={"ToDo"}
            header={<Title>{"ToDo"}</Title>}
            listId={"ToDo"}
            cards={columns["ToDo"]}
            internalScroll={withScrollableColumns}
            onCardClick={onCardClick}
            footer={
              <AddCardFooter
                onAdd={(str) => {
                  addNewTask(str);
                }}
              ></AddCardFooter>
            }
          />
          <Lane
            loading={loading}
            className="NormalLane"
            key={"Done"}
            header={<Title>{"Done"}</Title>}
            listId={"Done"}
            cards={columns["Done"]}
            internalScroll={withScrollableColumns}
            onCardClick={onCardClick}
          />
        </BoardContainer>
      </ParentContainer>
    </div>
  );
}
