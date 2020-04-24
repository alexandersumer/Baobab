/* Side bar base wrapper
 */
import styled from "styled-components";

export const Sidebar = styled.div`
  height: 230px;
  width: 50px;
  background: rgb(216, 213, 213);
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: sticky;
  top: 150px;
  left: 50px;
  border-radius: 10px;
  align-items: center;
  padding: 10px;
`;
