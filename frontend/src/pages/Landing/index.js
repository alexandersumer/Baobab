
/* TO BE FULLY IMPLEMENTED
*     - to create an intermediary page
*/
import * as React from "react";
import { cloneDeep, mapValues } from 'lodash'
import styled from "styled-components";
import * as actions from '@nanway/react-flow-chart/src/container/actions' // '../src/container/actions'
import { FlowChart, INodeInnerDefaultProps, FlowChartWithState} from "@nanway/react-flow-chart";
import { NodeStyles } from '../../nodes/NodeStyling'
import { NodeContent } from '../../nodes/NodeContents'
import { Page } from '../../canvas/Page'

// Harry's side bar related imports
import { DragAndDropSideBar } from "../../sidebar/DragAndDropSideBar"
import { DeleteButton, EditButton } from "../../sidebar/SideBarNodes"
import { Lower } from "../../sidebar/SideBarSections"

// Place holder chart until backend works
import { chartUni } from "../../canvas/chartUni"
import { chartInnerTree } from "../../canvas/chartInnerTree"


export class Landing extends React.Component {
  state = cloneDeep(chartUni)
  
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
              // potential aditional components 
              // Ports
              // CanvasOuter
              // CanvasInner ...
            }}
          />
          { chart.selected.type // Ternary statement?
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