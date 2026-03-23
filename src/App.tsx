import { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "./utilities";

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

const BulletinOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5em;
`;

const BulletinModal = styled.div`
  position: relative;
  width: min(34em, 100%);
  min-height: 50vh;
  background: ${colors.coolBlue};
  border-radius: 8px;
  padding: 2.5em 2em 2em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;
  font-size: 1.5em;
  white-space: pre-wrap;
  line-height: 1.5;
`;

const BulletinBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BulletinClose = styled.button`
  position: absolute;
  top: 0.7em;
  right: 0.7em;
  border: none;
  background: transparent;
  font-size: 1.5em;
  line-height: 1;
  cursor: pointer;
`;

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminLoginView, setAdminLoginView] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [bulletin, setBulletin] = useState<string | null>(null);
  const [showBulletin, setShowBulletin] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname === "/admin") {
      setAdminLoginView(true);
    }
  }, []);

  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname !== "/") {
      return;
    }

    (async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_URL}/get-bulletin`);
        const text = (await result.text()).trim();

        if (text) {
          setBulletin(text);
          setShowBulletin(true);
        }
      } catch (e) {
        return;
      }
    })();
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
        <IsMaintenance>Under maintenance! Will be back up by Friday morning.</IsMaintenance>
      )}

      {showBulletin && bulletin && (
        <BulletinOverlay>
          <BulletinModal>
            <BulletinClose
              aria-label="Close bulletin"
              onClick={() => {
                setShowBulletin(false);
              }}
            >
              ×
            </BulletinClose>
            <BulletinBody>{bulletin}</BulletinBody>
          </BulletinModal>
        </BulletinOverlay>
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
