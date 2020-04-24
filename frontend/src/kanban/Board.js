import * as React from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import { reorderCardMap } from "./reorder";
import { message } from "antd";
import { withRouter } from "react-router-dom";

export const BoardContainer = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  display: inline-flex;
`;

class BoardNoRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parentID: props.parentID,
      columns: props.initial,
      tree: props.treeID,
      loading: true
    };

    this.reload = this.reload.bind(this);
  }

  onDragEnd = result => {
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

    this.onColumnChange(data.cardMap, true);
  };

  onColumnChange = (newCols, update) => {
    this.setState({ columns: newCols });
    if (update) {
      return this.props.reorderBoard(newCols);
    }
  };

  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      const tokens = location.pathname.split("/");
      if (tokens[1] === "kanban") {
        this.reload(tokens[2]);
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidMount() {
    this.reload();
  }

  reload = (id=null) => {
    this.props
      .getData(id)
      .then(data => {
        var proj;
        var name;
        if (!data) {
        } else if (data.length === 3) {
          name = data[2];
          proj = data[1];
          data = data[0];
        } else if (data.length === 2) {
          proj = data[1];
          data = data[0];
        }
        this.setState({
          columns: data,
          tree: proj,
          name: name,
          loading: false
        });
      })
      .catch(error => {
        message.error("Failed to load board data. Error: " + error.message);
      });
  };

  render() {
    const columns = this.state.columns;
    const { withScrollableColumns, ControlledBoard } = this.props;

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <ControlledBoard
            loading={this.state.loading}
            withScrollableColumns={withScrollableColumns}
            reload={this.reload}
            columns={columns}
            onColumnChange={this.onColumnChange}
            treeID={this.state.tree}
            parentID={this.state.parentID}
            name={this.state.name}
            {...this.props}
          ></ControlledBoard>
        </DragDropContext>
      </React.Fragment>
    );
  }
}

export const Board = withRouter(BoardNoRouter);