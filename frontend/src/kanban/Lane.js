import * as React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card } from "./Card";
import { color, grid, borderRadius } from "./Constants";
import styled from "styled-components";
// import loadingSpinner from "../img/board-loading.gif";
import loadingSpinner from "../img/boring-board-loading.gif";

export const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) {
    return color.KANBAN_LANE_OVER;
  }
  if (isDraggingFrom) {
    return color.KANBAN_LANE_FROM;
  }
  return color.KANBAN_LANE_NORMAL;
};

const Wrapper = styled.div`
  background-color: ${props =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  height: fit-content;
  max-height: 800px;
  margin: 10px;
  flex-direction: column;
  opacity: inherit;
  padding: ${grid}px;
  border: ${grid}px;
  border-radius: ${borderRadius}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

// Make inside scrollable
const scrollContainerHeight = 250;
const dropZoneMinHeight = 50;
const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${dropZoneMinHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;
const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

const getRenderedCard = (cards, onCardClick) => (
  dragProvided,
  dragSnapshot,
  rubric
) => {
  const card = cards[rubric.source.index];
  return (
    <div>
      <Card
        key={card.id}
        data={card}
        isDragging={dragSnapshot.isDragging}
        provided={dragProvided}
        draggingOver={dragSnapshot.draggingOver}
        onCardClick={onCardClick}
      />
    </div>
  );
};

const CardList = React.memo(function CardList(props) {
  if (props.loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img src={loadingSpinner}></img>
      </div>
    );
  } else {
    return props.cards.map((card, index) => (
      <Draggable key={card.id} draggableId={card.id} index={index}>
        {getRenderedCard(props.cards, props.onCardClick)}
      </Draggable>
    ));
  }
});

function CardListContainer(props) {
  const { cards, dropProvided, header, footer, onCardClick, loading } = props;

  return (
    <Container>
      {header}
      <DropZone ref={dropProvided.innerRef}>
        <CardList onCardClick={onCardClick} cards={cards} loading={loading} />
        {dropProvided.placeholder}
      </DropZone>
      {footer}
    </Container>
  );
}

export default function Lane(props) {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = "LIST",
    listType,
    style,
    cards,
    header,
    footer,
    onCardClick,
    loading
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={getRenderedCard(cards, onCardClick)}
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <ScrollContainer style={scrollContainerStyle}>
              <CardListContainer
                loading={loading}
                cards={cards}
                dropProvided={dropProvided}
                header={header}
                footer={footer}
                onCardClick={onCardClick}
              />
            </ScrollContainer>
          ) : (
            <CardListContainer
              loading={loading}
              cards={cards}
              dropProvided={dropProvided}
              header={header}
              footer={footer}
              onCardClick={onCardClick}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}
