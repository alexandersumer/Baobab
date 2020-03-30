/* Side bar base wrapper
*/
import styled from 'styled-components'

export const Sidebar = styled.div`
  height: 100px;
  width: 50px;
  background: #F5F5F5;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 1;
  position: absolute;
  top: 150px;
  left: 50px;
  border-radius: 10px;
`