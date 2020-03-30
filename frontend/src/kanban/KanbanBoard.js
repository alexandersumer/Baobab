import React, { useState } from "react";

import {
  Board,
  BoardContainer
} from ".";

import Lane from "./Lane";
import { DoingTitle, Title } from "./Title";
import { doingWidth, color } from "./Constants";
import { AddCardFooter } from "./AddCardFooter";
import styled from "styled-components";
import { ModalTransition } from "@atlaskit/modal-dialog";
import { KanbanModal } from "./KanbanModal";

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
      ControlledBoard={e => {
        return KanbanBoardInner(e);
      }}
    ></Board>
  );
}

function KanbanBoardInner(props) {
  const { columns, onColumnChange, withScrollableColumns } = props;
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const onClose = () => {
    setOpen(false);
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
      })
    ];

    const found = foundArr.findIndex((element) => {
      return element != -1;
    });
    if (found < 0) {
      console.error("Couldn't find card with id: " + id);
    }

    var cols = ["ToDo", "Doing", "Done"];
    return {
      card: columns[cols[found]][foundArr[found]],
      board: cols[found],
      indexInArray: foundArr[found]
    };
  };

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

  const getNewCardStub = (task) => {
    var sum = "";
    columns["Doing"].map((val) => {
      sum = sum + val.id;
      return sum;
    });
    columns["ToDo"].map((val) => {
      sum = sum + val.id;
      return sum;
    });
    columns["Done"].map((val) => {
      sum = sum + val.id;
      return sum;
    });
    sum = sum + "69";
    return {
      id: sum,
      title: task
    };
  };

  const addNewTask = (task) => {
    const newData = getNewCardStub(task);
    let newColumns = {
      ...columns,
      ["ToDo"]: [...columns["ToDo"], newData]
    };
    onColumnChange(newColumns);
  };

  const onCardChange = (card) => {
    const changedCard = findCard(card.id);
    columns[changedCard.board][changedCard.indexInArray] = card;
    onColumnChange(columns);
  };

  const onCardDelete = (id) => {
    setOpen(false);
    setSelectedCard("");
    const changedCard = findCard(id);
    columns[changedCard.board].splice(changedCard.indexInArray, 1);
    onColumnChange(columns);
  };

  return (
    <div>
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
            key={"Doing"}
            header={<DoingTitle>{"Doing"}</DoingTitle>}
            listId={"Doing"}
            cards={columns.Doing}
            isDropDisabled={determineDropDisabled()}
            style={{ width: doingWidth }}
            onCardClick={onCardClick}
          />
        </BoardContainer>
        <BoardContainer>
          <Lane
            className="NormalLane"
            key={"ToDo"}
            header={<Title>{"ToDo"}</Title>}
            listId={"ToDo"}
            cards={columns["ToDo"]}
            internalScroll={withScrollableColumns}
            onCardClick={onCardClick}
            footer={
              <AddCardFooter
                onAdd={str => {
                  addNewTask(str);
                }}
              ></AddCardFooter>
            }
          />
          <Lane
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
