import styled from "styled-components";

export const CanvasOuter = styled.div`
  position: relative;
  background-size: 100vw 100vh;
  background-color: ${(props) => props.config.canvasColour};
  overflow: hidden;
  cursor: not-allowed;
  margin-left: -4%;
`;
