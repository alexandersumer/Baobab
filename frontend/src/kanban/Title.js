import { grid, color } from "./Constants";
import styled from "styled-components";

// $ExpectError - not sure why
// Tom isn't sure either
export const Title = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  margin-top: 0px;

  &:focus {
    outline: 2px solid ${color.P100};
    outline-offset: 2px;
  }
`;

export const DoingTitle = styled.h2`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  margin-top: 0px;
  text-align: center;

  &:focus {
    outline: 2px solid ${color.P100};
    outline-offset: 2px;
  }
`;
