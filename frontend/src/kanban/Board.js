import * as React from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import { reorderCardMap } from "./reorder";

export const BoardContainer = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  display: inline-flex;
`;

export class Board extends React.Component {
  state = {
    parentID: this.props.parentID,
    columns: this.props.initial
  };

  onDragEnd = (result) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const data = reorderCardMap({
      cardMap: this.state.columns,
      source,
      destination
    });

    this.setState({
      columns: data.cardMap
    });
  };

  componentDidMount() {
    this.setState({ columns: this.props.getData() });
  }

  render() {
    const columns = this.state.columns;
    const { withScrollableColumns, ControlledBoard } = this.props;

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <ControlledBoard
            withScrollableColumns={withScrollableColumns}
            columns={columns}
            onColumnChange={newCols => this.setState({ columns: newCols })}
          ></ControlledBoard>
        </DragDropContext>
      </React.Fragment>
    );
  }
}
