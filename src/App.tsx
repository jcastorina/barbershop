import { useState, useEffect } from "react";
import styled from "styled-components";

import { StyledAdminLoggedIn, StyledAdminLoginView } from "./Admin";
import { ScheduleForm } from "./ScheduleForm";
import { GuideButton, Colors, colors } from "./utilities";

const StyledLogo = styled.img`
  width: 10em;
  height: 10em;
`;

const Header = styled.div`
  margin: 0;
`;

const Content = styled.div``;

const Footer = styled.div`
  position: absolute;
  background-color: ${colors.floor};
  color: black;
  bottom: 0px;
  width: 100%;
  height: 2em;
  display: grid;
  place-items: center;
`;

function App() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminLoginView, setAdminLoginView] = useState(false);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname === "/admin") {
      setAdminLoginView(true);
    }
  }, []);

  if (adminLoggedIn) {
    return (
      <StyledAdminLoggedIn
        setAdminLoggedIn={setAdminLoggedIn}
        setAdminLoginView={setAdminLoginView}
      />
    );
  }

  if (adminLoginView) {
    return (
      <StyledAdminLoginView
        password={password}
        setPassword={setPassword}
        setAdminLoggedIn={setAdminLoggedIn}
        setAdminLoginView={setAdminLoginView}
      />
    );
  }

  return (
    <>
      <Colors showColors={showColors} />
      <Header>
        <StyledLogo src={"main-logo.jpg"} alt={"Jefferson Street Barber Shop"}></StyledLogo>
      </Header>

      <Content>
        <h2>Make an appointment!</h2>
        <ScheduleForm />
      </Content>
      <Footer>Footer Content</Footer>
      <GuideButton handleClick={() => setShowColors((show) => !show)} />
    </>
  );
}

export default App;
