import React, { useState } from "react";
import { CardContainer, CardContent, CardFooter } from "./CardCommon";
import { ReactComponent as KanbanCancelIcon } from "../img/kanban-cancel.svg";
import { ReactComponent as KanbanOkIcon } from "../img/kanban-ok.svg";
import { clickableButton } from "./QueueFooter";
import kba from "../img/kanban-add.png";

export function AddCardFooter(props) {
  const [clicked, setClicked] = useState(false);
  const [taskName, setTaskName] = useState("");
  const { onAdd } = props;

  const onAddText = text => {
    if (text.length > 0) {
      setTaskName(text);
    }
  };

  const onClickConfirm = () => {
    if (taskName.length > 0) {
      onAdd(taskName);
    }
    setClicked(false);
  };

  if (clicked) {
    return (
      <div>
        <CardContainer className="CardNoHover">
          <CardContent>
            <p>
              <b>What needs to be done?</b>
            </p>
            <input
              ref={input => input && input.focus()}
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
            onClick={() => {
              onClickConfirm();
            }}
          ></KanbanOkIcon>
          <KanbanCancelIcon
            className="KanbanButton"
            onClick={() => {
              setClicked(false);
            }}
          ></KanbanCancelIcon>
        </CardFooter>
      </div>
    );
  } else {
    return (
      <CardFooter>
        <div className="KanbanPNGButton">
          {clickableButton(kba, () => {
            setClicked(true);
          })}
        </div>
      </CardFooter>
    );
  }
}
