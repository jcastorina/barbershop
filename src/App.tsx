import { useState, useEffect } from "react";
import styled from "styled-components";

import { StyledAdminLoggedIn, StyledAdminLoginView } from "./Admin";
import { ScheduleForm } from "./ScheduleForm";
import { colors } from "./utilities";

const AppView = styled.div`
  box-sizing: content-box;

  overflow: scroll;

  height: 100vh;
`;

const StyledLogo = styled.img`
  width: 10em;
  height: 10em;
`;

const Header = styled.div`
  margin-bottom: 2em;
`;

const ResponsiveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
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

  box-shadow: 0px -2px 4px ${colors.milGreen};
  //  min-width: 32em;
`;

const Anchor = styled.a`
  padding: 1.5em 2.4em;

  background-color: ${colors.coolBlue};

  font-size: 1em;

  color: white;

  border: none;

  margin: 1em;

  text-decoration: none;

  border-radius: 2px;

  display: grid;
  place-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${colors.chairBlue};
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;

    gap: 10px;
  }

  @media (max-width: 768px) {
    // background-color: green;
    margin-top: 3em;
  }

  @media (min-height: 600px) {
    //margin-top: 40em;
    height: 24em;
    align-self: center;

    // flex-direction: column;
    justify-content: center;
  }

  /* @media (max-width: 768px) {
    justify-content: center;
  } */
`;

function App() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminLoginView, setAdminLoginView] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <AppView>
      <Header>
        <StyledLogo src={"main-logo.jpg"} alt={"Jefferson Street Barber Shop"}></StyledLogo>
      </Header>
      <ResponsiveWrapper>
        <Content>
          {!showForm && (
            <ButtonContainer>
              <Anchor href={"tel:+1-612-524-8519"}>CALL NOW</Anchor>
              <Anchor
                href={
                  "https://www.google.com/maps/dir//Jefferson+Street+Barbershop/data=!4m8!4m7!1m0!1m5!1m1!1s0x52b323ea2726a801:0x2a911b3a0c1e3412!2m2!1d-93.2566332!2d45.182939"
                }
                target={"_blank"}
              >
                GET DIRECTIONS
              </Anchor>
              <Anchor
                onClick={() => {
                  setShowForm(true);
                }}
              >
                MAKE AN APPOINTMENT!
              </Anchor>
            </ButtonContainer>
          )}
          {showForm && <ScheduleForm showForm={showForm} setShowForm={setShowForm} />}
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

// useEffect(() => {
//   const pathname = window.location.pathname;

//   if (pathname === "/admin") {
//     setAdminLoginView(true);
//   }
// }, []);

// if (adminLoggedIn) {
//   return (
//     <StyledAdminLoggedIn
//       setAdminLoggedIn={setAdminLoggedIn}
//       setAdminLoginView={setAdminLoginView}
//     />
//   );
// }

// if (adminLoginView) {
//   return (
//     <StyledAdminLoginView
//       password={password}
//       setPassword={setPassword}
//       setAdminLoggedIn={setAdminLoggedIn}
//       setAdminLoginView={setAdminLoginView}
//     />
//   );
// }
