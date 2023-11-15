import { useState, useEffect } from "react";
import styled from "styled-components";

import { StyledAdminLoggedIn, StyledAdminLoginView } from "./Admin";
import { ScheduleForm } from "./ScheduleForm";
import { GuideButton, Colors, colors } from "./utilities";

const AppView = styled.div`
  //  height: 100%;
  /* width: 100vw;
  min-width: 32em; */

  box-sizing: content-box;

  // position: relative;
`;

const StyledLogo = styled.img`
  width: 10em;
  height: 10em;
`;

const Header = styled.div`
  // margin: 0;
  margin-bottom: 2em;
`;

const ResponsiveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Content = styled.div`
  // margin-left: 1em;
`;

const Footer = styled.div`
  position: fixed;
  background-color: ${colors.floor};
  color: black;
  bottom: 0px;
  width: 100%;
  height: 4em;
  display: grid;
  place-items: center;
  //  min-width: 32em;
`;

const MakeAnAppointment = styled.h2`
  // margin-bottom: 2em;
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
    <AppView>
      <Header>
        <StyledLogo src={"main-logo.jpg"} alt={"Jefferson Street Barber Shop"}></StyledLogo>
      </Header>
      <ResponsiveWrapper>
        <Content>
          <MakeAnAppointment>Make an appointment!</MakeAnAppointment>
          <ScheduleForm />
        </Content>
      </ResponsiveWrapper>

      <Footer>Footer Content</Footer>
    </AppView>
  );
}

export default App;
// <Colors showColors={showColors} />
// <Footer>Footer Content</Footer>
// <GuideButton handleClick={() => setShowColors((show) => !show)} />
