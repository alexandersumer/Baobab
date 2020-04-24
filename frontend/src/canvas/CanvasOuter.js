import styled from "styled-components";
import Sike from "../img/whatDoThenumbersMeAN.gif";
import nice from "../img/assdeaddicks.jpg";
import { SketchPicker} from 'react-color';

// Add the shit here cunt from Editing Utils

export const CanvasOuter = styled.div`
  position: relative;
  background-size: 100vw 100vh;
  background-color: ${props => props.config.canvasColour};
  overflow: hidden  ;
  cursor: not-allowed;
  margin-left: -4%;
`;


/*
previous backgrond-image bullshit
  background-image: url(${nice});
*/