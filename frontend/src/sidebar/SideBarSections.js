/* Upper and lower styling of side bar
 */
import styled from "styled-components";

export const Upper = styled.div`
  height: 120px;
  width: 50px;
  margin: 10px;
  background: rgb(216, 213, 213);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 0px;
  left: -10px;
  z-index: 1;
  border-radius: 10px;
`;

export const Lower = styled.div`
  height: 120px;
  width: 50px;
  margin: 10px;
  background: rgb(216, 213, 213);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: sticky;
  top: 230px;
  z-index: 2;
  border-radius: 10px;
`;
