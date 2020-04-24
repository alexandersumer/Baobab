import { color, grid, borderRadius } from "./Constants";
import styled from "styled-components";

export const CardContainer = styled.div`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: transparent;
  background-color: ${props => (props.color ? props.color : "white")};
  box-shadow: ${props => (props.isDragging ? `2px 2px 1px #A5ADBA` : "none")};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: 10px;
  margin-bottom: ${grid}px;
  user-select: none;

  &:hover {
    opacity: 0.75;
  }

  /* anchor overrides */
  color: ${color.N900};

  &:active {
    color: ${color.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${color.N900};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

export const CardContent = styled.div`
  /* flex child */
  flex-grow: 1;

  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-wrap: break-word;
`;

export const CardFooter = styled.div.attrs(props => ({
  className: "shadowrealm"
}))`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
  justify-content: center;
`;
