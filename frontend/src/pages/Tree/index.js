/* Tree Index page
*
*/
import React from "react";
import { FlowChart, IChart, INodeInnerDefaultProps, INodeDefaultProps, FlowChartWithState } from "@nanway/react-flow-chart";
import styled from "styled-components";
import { cloneDeep, mapValues } from 'lodash'
import * as actions from '@nanway/react-flow-chart/src/container/actions' // '../src/container/actions'
import { NodeStyles } from '../../nodes/NodeStyling'
import { NodeContent } from '../../nodes/NodeContents'
import { Page } from '../../canvas/Page'
// Dummy Stubs
import { chartInnerTree } from "../../canvas/chartInnerTree"
import { chartUni} from "../../canvas/chartUni"
import { queueData2 } from '../../canvas/queueData2'
// Sidebar related imports
import { DeleteButton, EditButton } from "../../sidebar/SideBarNodes"
import { DragAndDropSideBar } from "../../sidebar/DragAndDropSideBar"
import { Lower } from "../../sidebar/SideBarSections"



const getChartDataStub = (id) => {
  return chartInnerTree;
};

const getQueueDataStub = () => {
  return queueData2; 
// never actually called because of NodeContents.tsx
};

export class Tree extends React.Component {
  state = cloneDeep(chartInnerTree)
  
  render () {
    const chart = this.state
    const stateActions = mapValues(actions, (func) =>
      (...args) => this.setState(func(...args)))

    return (
      <Page>
          <DragAndDropSideBar></DragAndDropSideBar>

          <FlowChart
            chart={chart}
            callbacks={stateActions}
            Components={{
              NodeInner: NodeContent,
              Node: NodeStyles,
              // Additional components 
              // Ports
              // CanvasOuter
              // CanvasInner ...
            }}
          />

          { chart.selected.type
          ? <div>
              <Lower>
                <EditButton onClick={() => stateActions.onDeleteKey({})}> 
                </EditButton>

                <DeleteButton onClick={() => stateActions.onDeleteKey({})}></DeleteButton>
              </Lower>
            </div>
          : <div></div> }

      </Page>
    )
  }
}


























// export class Tree extends React.Component<
//   RouteComponentProps<KanbanTreePageProps>
// > {
//   constructor(props: any) {
//     super(props);
//   }

//   state: TreeState = {
//     parentId: this.props.match.params.parentID,
//     // chartState: {
//     //   offset: { x: 0, y: 0 },
//     //   nodes: {},
//     //   links: {},
//     //   selected: {},
//     //   hovered: {}
//     // }
//     chartState: cloneDeep(chartUni)
//   };
//   // TODO: MOVE THIS TO COMPONENT DID MOUNT/ FIX THE DATA FETCHING
//   // componentWillMount() {
//   //   this.setState({ chartState: cloneDeep(chartUni) });
//   // }
//   render() {
//     const chart = this.state
//     const stateActions = mapValues(actions, (func: any) =>
//       (...args: any) => this.setState(func(...args))) as typeof actions
//     console.log(this.state.chartState)
//     return (
//       <Page>
//         <Content>
//           <DragAndDropSideBar></DragAndDropSideBar>
//           <FlowChart
//             chart={this.state.chartState}
//             callbacks={stateActions}
//             Components={{
//               NodeInner: NodeOuterCustom,
//               Node: NodeCustom,
//             }}
//           />  
//         </Content>
//       </Page>
//     );
//   }
// }
