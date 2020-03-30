/* Customizes the style of the node dependant 
*    of type of node (input/output)
*/
import * as React from 'react'
import styled from 'styled-components'
import { FlowChart, INodeInnerDefaultProps, INodeDefaultProps, FlowChartWithState } from '@nanway/react-flow-chart'
import { DaddyTreeNode, TreeNode, QueueHead} from './nodeTypes'
// Place holder chart until backend works
import { chartSimple } from '../canvas/chartSimple'
import { chartUni } from '../canvas/chartUni'

export const NodeStyles = React.forwardRef(({ node, children, ...otherProps }, ref) => {
  if (node.properties.custom === 'output-only') {
    return (
      <DaddyTreeNode ref={ref} {...otherProps}>
        {children}
      </DaddyTreeNode>
    )
  } else if (node.properties.custom === 'input-output') {
      return (
        <TreeNode ref={ref} {...otherProps}>
          {children}
        </TreeNode>
      )
  } else if (node.properties.custom === 'input-only') {
      return (
        <QueueHead ref={ref} {...otherProps}>
          {children}
        </QueueHead>
      )
  } else { 
      return ( // Does nothing
        <QueueHead ref={ref} {...otherProps}>
          {children}
        </QueueHead>
      )
  }
})

















// // Code bank just in case 
//  const NodeInnerCustom = ({ node, config }: INodeInnerDefaultProps ) => {
//   if (node.type === 'output-only') {
//     return (
//       <TreeNode>
//         <p>Nanway is gay and this code does nothing gofid-20</p>
//       </TreeNode>
//     )
//   } else {
//     return (
//       <QueueHead>
//         <p>Lovers:</p>
//         <Input
//           type="string"
//           placeholder="Big Penis"
//           onChange={(e) => console.log(e)}
//           onClick={(e) => e.stopPropagation()}
//           onMouseUp={(e) => e.stopPropagation()}
//           onMouseDown={(e) => e.stopPropagation()}
//         />
//       </QueueHead>
//     )
//   } // add if else blocks for different types of nodes here homie!
// }
// // This shouldn't do anything
// export class CustomNodeInnerDemo extends React.Component {
//   public state = cloneDeep(chartSimple)
//   public render () {
//     const chart = this.state
//     const stateActions = mapValues(actions, (func: any) => 
//       (...args: any) => this.setState(func(...args))) as typeof actions

//     return (
//       <Page>
//         <FlowChart
//           chart={chart}
//           callbacks={stateActions}
//           Components={{
//             NodeInner: NodeInnerCustom,
//           }}
//         />

//       </Page>
//     )
//   }
// }