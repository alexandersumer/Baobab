import React from "react";
import "./KanbanStyles.css";
import { CardContainer, CardContent } from "./CardCommon";
import { color, kanbanType, nestedTree } from "./Constants";
import { DescriptionSnippet } from "./DescriptionIcon";

// Imports for editing
import InlineEdit from "@atlaskit/inline-edit";
import styled from "styled-components";
import Textfield from "@atlaskit/textfield";
import { ReadViewContainer } from "../nodes/nodeTypes";

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
    case kanbanType: {
      return {
        backgroundColor: color.QUEUE_KANBAN,
        color: "white"
      };
    }
    case nestedTree: {
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
        // you're fucking me cunt
        if (onCardClick) onCardClick(data.id);
      }}
    >
      <CardContent>
        {/* <InlineEdit
          onClick={(e) => e.preventDefault()}
          defaultValue={heading ? heading : "penis"}
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          hideActionButtons={false}
          readView={() => (
            <ReadViewContainer>
              {heading || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={value => {
            data.title = value;
            //updateName(node.id, value); // currently does not get called, why?
          }}
        /> */}
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

// <Footer>
// <CardID>id:{data.id}</CardID>
// </Footer>

/*  Previous

      <CardContent>
        {data.title}
      </CardContent> 
*/
