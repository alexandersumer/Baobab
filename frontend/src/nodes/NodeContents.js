/* Customizes the internals/contents of a node
*   (NOT COLOURING)
*/
import * as React from 'react'
import styled from 'styled-components'
import { FlowChart, INodeInnerDefaultProps, INodeDefaultProps, IChart } from '@nanway/react-flow-chart'
import { QueueKanban } from "../kanban";
import { FuckYouSlut, FuckYouTitle } from "./nodeTypes"
// Place holder chart until backend works
//import { chartSimple } from '../canvas/chartSimple'
import { chartUni } from '../canvas/chartUni'
import { queueData } from '../canvas/queueData'


const getChartDataStub = (id) => {
  return chartUni;
};

const getQueueDataStub = () => {
  return queueData;
};

// TODO make this take in unique queueData
export const NodeContent = ({ node, config }) => {
  if (node.properties.custom === 'output-only') {
    return (
        <div> {node.properties.description}</div>
    )
  } else if (node.properties.custom === 'input-output'){
      return (
          <div>{node.properties.description}</div>
      )
  } else if (node.properties.custom === 'input-only'){
      return ( // maybe use nanway's lane thing?
        <FuckYouSlut>
        <FuckYouTitle>
          {node.properties.description}
        </FuckYouTitle>
          <QueueKanban 
            parentID={node.id}
            getData={getQueueDataStub}
            className="shadowrealm"
            initial={{ QueueItems: [] }}
          />
        </FuckYouSlut>
      )
  } else { // just in case
    return (
      <p>penis</p>
    )
  }
}













// export class CustomNodeInnerDemoCopy extends React.Component {
//   public state = cloneDeep(chartUni)
//   public render () {
//     const chart = this.state
//     const stateActions = mapValues(actions, (func: any) =>
//       (...args: any) => this.setState(func(...args))) as typeof actions

//     return (
//       <Page>
//         <Content>
//           <DragAndDropSideBar></DragAndDropSideBar>

//           <FlowChart
//             chart={chart}
//             callbacks={stateActions}
//             Components={{
//               NodeInner: NodeOuterCustom,
//               Node: NodeCustom,
//               // Additional components 
//               // Ports
//               // CanvasOuter
//               // CanvasInner ...
//             }}
//           />
//           { chart.selected.type
//           ? <div>
//               <LowerNodesBox>
//                 <EditButton onClick={() => stateActions.onDeleteKey({})}> 
//                 </EditButton>

//                 <DeleteButtonStyling onClick={() => stateActions.onDeleteKey({})}></DeleteButtonStyling>
//               </LowerNodesBox>
//             </div>
//           : <div></div> }
//         </Content>
//       </Page>
//     )
//   }
// }