import React from "react";
import { QueueKanban } from "../../kanban";
import { FlowChartWithState } from "@nanway/react-flow-chart";
import styled from "styled-components";

const queueData = {
  QueueItems: [
    {
      id: "4",
      title: "hello1",
      type: "kanban"
    },
    {
      id: "2",
      title: "trello",
      type: "nestedTree"
    },
    {
      id: "3",
      title: "hehe xd me",
      type: "kanban"
    },
    {
      id: "8",
      title: "hehe xd me",
      type: "kanban"
    },
    {
      id: "6",
      title: "hehe xd me",
      type: "kanban"
    }
  ]
};

const chartSimple = {
  offset: {
    x: 0,
    y: 0
  },
  nodes: {
    node1: {
      id: "node1",
      type: "output-only",
      position: {
        x: 300,
        y: 100
      },
      ports: {
        port1: {
          id: "port1",
          type: "output",
          properties: {
            value: "yes"
          }
        },
        port2: {
          id: "port2",
          type: "output",
          properties: {
            value: "no"
          }
        }
      }
    },
    node2: {
      id: "node2",
      type: "input-output",
      position: {
        x: 300,
        y: 300
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        },
        port2: {
          id: "port2",
          type: "output"
        }
      }
    }
  },
  links: {
    link1: {
      id: "link1",
      from: {
        nodeId: "node1",
        portId: "port2"
      },
      to: {
        nodeId: "node2",
        portId: "port1"
      }
    }
  },
  selected: {},
  hovered: {}
};

const getChartDataStub = id => {
  return chartSimple;
};

const getQueueDataStub = () => {
  return queueData;
};

const Outer = styled.div`
  padding: 30px;
  display: flex;
`;

const NodeInnerCustom = props => {
  const { node, config } = props;
  if (node.type === "output-only") {
    return (
      <Outer>
        <p>Use Node inner to customise the content of the node</p>
      </Outer>
    );
  } else {
    return (
      <Outer>
        <QueueKanban
          parentID={node.id}
          getData={getQueueDataStub}
          className="shadowrealm"
          initial={{ QueueItems: [] }}
        />
      </Outer>
    );
  }
};

export class Tree extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    parentId: this.props.match.params.parentID,
    chartState: {
      offset: { x: 0, y: 0 },
      nodes: {},
      links: {},
      selected: {},
      hovered: {}
    }
  };

  // TODO: MOVE THIS TO COMPONENT DID MOUNT/ FIX THE DATA FETCHING
  componentWillMount() {
    this.setState({ chartState: getChartDataStub(this.state.parentId) });
  }

  render() {
    return (
      <FlowChartWithState
        initialValue={this.state.chartState}
        Components={{
          NodeInner: NodeInnerCustom
        }}
      />
    );
  }
}
