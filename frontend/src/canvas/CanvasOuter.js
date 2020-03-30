import * as React from 'react'
import styled from 'styled-components'
import { FlowChartWithState } from "@nanway/react-flow-chart" 
import { Page } from './Page'

import { chartSimple } from './chartSimple'

const CanvasOuterCustom = styled.div`
  position: relative;
  background-size: 10px 10px;
  background-color: #F5F5F5;
  background-image:
    linear-gradient(90deg,hsla(0,0%,100%,.1) 1px,transparent 0),
    linear-gradient(180deg,hsla(0,0%,100%,.1) 1px,transparent 0);
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: not-allowed;
`

export const CustomCanvasOuterDemo = () => {
  return (
    <Page>
      <FlowChartWithState
        initialValue={chartSimple}
        Components={ {
          CanvasOuter: CanvasOuterCustom,
        }}
      />
    </Page>
  )
}