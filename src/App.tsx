import { useState, useEffect } from "react";

import { StyledAdminLoggedIn, StyledAdminLoginView } from "./Admin";
import { ScheduleForm } from "./ScheduleForm";
import {
  IsMaintenance,
  AppView,
  Header,
  StyledLogo,
  StyledPrices,
  Footer,
  Anchor,
  Content,
  ButtonContainer,
} from "./components";

const isMaintenance = false;

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(true);
  const [password, setPassword] = useState("");
  const [adminLoginView, setAdminLoginView] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPrices, setShowPrices] = useState(false);

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
      {isMaintenance && (
        <IsMaintenance>Under maintenance! Will be back up by Wednesday morning.</IsMaintenance>
      )}

      <AppView>
        <Header>
          <StyledLogo src={"main-logo.png"} alt={"Jefferson Street Barber Shop"}></StyledLogo>
        </Header>
        <Content>
          {showPrices && <StyledPrices handleClick={() => setShowPrices(false)} />}
          {showForm && <ScheduleForm setShowForm={setShowForm} />}
          {!showForm && !showPrices && (
            <ButtonContainer>
              <Anchor
                className={"make-appointment-button"}
                onClick={() => {
                  setShowForm(true);
                }}
              >
                MAKE AN APPOINTMENT
              </Anchor>
              <hr />
              <Anchor
                onClick={() => {
                  setShowPrices(true);
                }}
              >
                PRICES
              </Anchor>
              <Anchor
                href={
                  "https://www.google.com/maps/dir//Jefferson+Street+Barbershop/data=!4m8!4m7!1m0!1m5!1m1!1s0x52b323ea2726a801:0x2a911b3a0c1e3412!2m2!1d-93.2566332!2d45.182939"
                }
                target={"_blank"}
              >
                GET DIRECTIONS
              </Anchor>
              <Anchor href={"tel:+1-612-524-8519"}>CALL</Anchor>
            </ButtonContainer>
          )}
        </Content>

        <Footer>Proudly serving since 2013</Footer>
      </AppView>
    </>
  );
}

export default App;
