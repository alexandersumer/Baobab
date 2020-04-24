import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    max-width: 100vw;
    max-height: 100vh;
    box-sizing: border-box;
    font-family: sans-serif;
    overflow: hidden;

  }
  *, :after, :before {
    box-sizing: inherit;
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const Page = ({ style, children }) => (
  <PageContent style={style}>
    {children}
    <GlobalStyle />
  </PageContent>
);
