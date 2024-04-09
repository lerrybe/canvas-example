import styled from "@emotion/styled";
import { Global } from "@emotion/react";
import { Outlet } from "react-router-dom";

import reset from "../../styles/reset";

export default function RootLayout() {
  return (
    <Main>
      <Global styles={reset} />
      <Outlet />
    </Main>
  );
}

const Main = styled.main`
  width: 100vw;
  height: 100vh;
`;
