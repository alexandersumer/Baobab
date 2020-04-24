export const chartUni = {
  offset: {
    x: 0,
    y: 0
  },
  nodes: {
    node1: {
      id: "node1", // Life node
      type: "",
      properties: {
        description: "Life",
        custom: "output-only"
      },
      position: {
        x: 700,
        y: 100
      },
      ports: {
        port1: {
          id: "port1",
          type: "output",
          properties: {
            value: "yes"
          }
        }
      }
    },
    node2: {
      id: "node2", // University Tree node
      type: "",
      properties: {
        description: "University",
        custom: "input-output"
      },
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
        },
        port3: {
          id: "port3",
          type: "output"
        }
      }
    },
    node3: {
      id: "node3", // Work queue node
      type: "",
      properties: {
        description: "Work", // maybe have the additional shit here
        custom: "input-only"
      },
      position: {
        x: 700,
        y: 300
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        }
      }
    },
    node4: {
      id: "node4", // Health queue node
      type: "",
      properties: {
        description: "Health",
        custom: "input-only"
      },
      position: {
        x: 1100,
        y: 300
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        }
      }
    },
    node5: {
      id: "node5", // 3900  queue node
      type: "",
      properties: {
        description: "3900",
        custom: "input-only"
      },
      position: {
        x: 100,
        y: 500
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        }
      }
    },
    node6: {
      id: "node6", // Society  queue node
      type: "",
      properties: {
        description: "Society",
        custom: "input-only"
      },
      position: {
        x: 500,
        y: 500
      },
      ports: {
        port1: {
          id: "port1",
          type: "input"
        }
      }
    }
  },
  links: {
    link1: {
      id: "link1", // life to uni
      from: {
        nodeId: "node1",
        portId: "port1"
      },
      to: {
        nodeId: "node2",
        portId: "port1"
      }
      //   properties: {
      //     label: 'example link label',
      //   },
    },
    link2: {
      id: "link2", // life to work
      from: {
        nodeId: "node1",
        portId: "port1"
      },
      to: {
        nodeId: "node3",
        portId: "port1"
      }
      //   properties: {
      //     label: 'another example link label',
      //   },
    },
    link3: {
      id: "link3",
      from: {
        nodeId: "node1",
        portId: "port1"
      },
      to: {
        nodeId: "node4",
        portId: "port1"
      }
    },
    link4: {
      id: "link4",
      from: {
        nodeId: "node2",
        portId: "port2"
      },
      to: {
        nodeId: "node5",
        portId: "port1"
      }
    },
    link5: {
      id: "link5",
      from: {
        nodeId: "node2",
        portId: "port3"
      },
      to: {
        nodeId: "node6",
        portId: "port1"
      }
    }
  },
  selected: {},
  hovered: {}
};
