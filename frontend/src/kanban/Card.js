import React from "react";
import "./KanbanStyles.css";
import { CardContainer, CardContent } from "./CardCommon";
import { color, kanbanType, nestedTree } from "./Constants";
import { DescriptionSnippet } from "./DescriptionIcon";

export function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

function decideCardType(card) {
  switch (card) {
    case kanbanType: {
      return {
        backgroundColor: color.QUEUE_KANBAN,
        color: "white",
      };
    }
    case nestedTree: {
      return {
        backgroundColor: color.QUEUE_NESTED,
        color: "white",
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
  var hasDescription = false;
  var descriptionContent = "";

  if (data.description !== undefined) {
    hasDescription = true;
    if (data.description.length > 38) {
      descriptionContent = data.description.substr(0, 38) + "...";
    } else {
      descriptionContent = data.description;
    }
  } else {
    descriptionContent = "";
  }

  if (data.type) {
    style = decideCardType(data.type);
  }

  const heading = data.title;

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
      <CardContent>
        {data.title}
        <div>
          {hasDescription ? (
            <DescriptionSnippet>{descriptionContent}</DescriptionSnippet>
          ) : (
            <div></div>
          )}
        </div>
      </CardContent>
    </CardContainer>
  );
}
