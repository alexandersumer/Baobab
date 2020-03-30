/* CSS Styling for the three types of nodes:
*
*   - DaddyTreeNode (root node, output-only)
*   - TreeNode (clickable, input-output)
*   - QueueHead (give me head)
*/
import styled from 'styled-components'

export const DaddyTreeNode = styled.div`
  position: absolute;
  width: 175px;
  height: 10px;
  padding: 30px;
  text-align: center;
  veritcal-align: center;
  line-height: 10px;
  background: #FA7C92;
  color: #F5F5F5;
  border-radius: 10px;
`

export const TreeNode = styled.div`
  position: absolute;
  width: 175px;
  height: 10px;
  padding: 30px;
  text-align: center;
  veritcal-align: center;
  line-height: 10px;
  background: #FA7C92;
  color: #F5F5F5;
  border-radius: 10px;
`
export const QueueHead = styled.div`
  position: absolute;
  width: 175px;
  height: 10px;
  padding: 30px;
  text-align: center;
  veritcal-align: center;
  background: #6EC4DB;
  color: #F5F5F5;
  border-radius: 10px;
`

export const FuckYouSlut = styled.div`
  right: 41px;
  position: relative;
`;

export const FuckYouTitle =styled.h4`
  position: relative;
  top: -15px;
  margin: 0;
  left: 35%;
  top: -7.5px;
`;

// Input styling, just for reference. Never called.
const Input = styled.input` 
  padding: 10px;
  border: 1px solid cornflowerblue;
  width: 100%;
  `