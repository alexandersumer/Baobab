/* Renders the upper section of side bar
*     - Will need to fix the type of thing it creates
*     - Edit functionality is TODO
*/
import * as React from 'react'
import { REACT_FLOW_CHART } from '@nanway/react-flow-chart'

import { Sidebar } from './SideBar'
import { Upper } from './SideBarSections'
import { TreeButton, QueueButton } from "./SideBarNodes"

export const TreeNode = ({ type, ports, properties }) => {
  return (
    <TreeButton
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({ type, ports, properties }))
      } }
    >
      {type}
    </TreeButton>
  )
}

export const QueueNode = ({ type, ports, properties }) => {
  return (
    <QueueButton
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({ type, ports, properties }))
      } }
    >
      {type}
    </QueueButton>
  )
}

export const DragAndDropSideBar = () => (
      <Sidebar> 
        <Upper>
          <TreeNode
              type=""
              ports={ {
              port1: {
                  id: 'port1',
                  type: 'top',
                  properties: {
                  custom: 'property',
                  },
              },
              port2: {
                  id: 'port1',
                  type: 'bottom',
                  properties: {
                  custom: 'property',
                  },
              },
              } }
              properties={ {
                custom: 'input-output',
                description: 'kissa sins',
              }}
          />
          <QueueNode
              type=""
              ports={ {
              port1: {
                  id: 'port1',
                  type: 'top',
                  properties: {
                    custom: 'property',
                  },
              },
              } }
              properties={ {
               description: "jonny sins",
               custom: 'input-only',
              }}
          />
        </Upper>
      </Sidebar>
)