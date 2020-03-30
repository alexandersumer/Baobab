import React from "react";
import "./KanbanStyles.css";
import { CardContainer, CardContent } from "./CardCommon";
import { color } from "./Constants";

export function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style
  };
}

function decideCardType(card) {
  switch (card) {
    case "kanban": {
      return {
        backgroundColor: color.QUEUE_KANBAN,
        color: "white"
      };
    }
    case "nestedTree": {
      return {
        backgroundColor: color.QUEUE_NESTED,
        color: "white"
      };
    }
    default: {
      break;
    }
  }
}

export function Card(props) {
  const { data, isDragging, provided, index, onCardClick } = props;
  var style = props.style;

  if (data.type) {
    style = decideCardType(data.type);
  }

  return (
    <CardContainer
      className="shadowrealm"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={data.id}
      data-index={index}
      onClick={() => {
        if (onCardClick) onCardClick(data.id);
      }}
    >
      <CardContent>{data.title}</CardContent>
    </CardContainer>
  );
}

// <Footer>
// <CardID>id:{data.id}</CardID>
// </Footer>
