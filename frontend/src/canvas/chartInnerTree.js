export const chartInnerTree = {
  offset: {
    x: 0,
    y: 0,
  },
  nodes: {
    node1: {
      id: 'node1', // root node
      type: '',
      properties: {
          description: "don't fail",
          custom: "output-only"
      },
      position: {
        x: 700,
        y: 100,
      },
      ports: {
        port1: {
          id: 'port1',
          type: 'output',
          properties: {
            value: 'yes',
          },
        },
      },
    },
    node2: {
      id: 'node2', // Motivation
      type: '',
      properties: {
          description: "Motivation",
          custom: "input-output"
      },
      position: {
        x: 300,
        y: 300,
      },
      ports: {
        port1: {
          id: 'port1',
          type: 'input',
        },
        port2: {
          id: 'port2',
          type: 'output',
        },
      },
    },
    node3: {
      id: 'node3', // Study
      type: '',
      properties: {
          description: "Study" ,
          custom: "input-only"
      },
      position: {
        x: 700,
        y: 300,
      },
      ports: {
        port1: {
          id: 'port1',
          type: 'input',
        },
      },
    },
    node5: {
      id: 'node5', // Connected to Motivation
      type: '',
      properties: {
          description: "Quotes",
          custom: "input-only"
      },
      position: {
        x: 300,
        y: 500,
      },
      ports: {
        port1: {
          id: 'port1',
          type: 'input',
        },
      },
    },
  },
  links: {
    link1: {
      id: 'link1', // life to uni
      from: {
        nodeId: 'node1',
        portId: 'port1',
      },
      to: {
        nodeId: 'node2',
        portId: 'port1',
      },
    },
    link2: {
      id: 'link2', // life to work
      from: {
        nodeId: 'node1',
        portId: 'port1',
      },
      to: {
        nodeId: 'node3',
        portId: 'port1',
      },
    },
    link4: {
      id: 'link4',
      from: {
        nodeId: 'node2',
        portId: 'port2',
      },
      to: {
        nodeId: 'node5',
        portId: 'port1',
      },
    },
  },
  selected: {},
  hovered: {},
}