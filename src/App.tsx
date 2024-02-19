import { useState, useEffect } from "react";
import styled from "styled-components";

import { StyledAdminLoggedIn, StyledAdminLoginView } from "./Admin";
import { ScheduleForm } from "./ScheduleForm";
import { colors } from "./utilities";

const mediaBreak = "830px";

const IsMaintenance = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 999;
`;

const AppView = styled.div`
  box-sizing: content-box;

  overflow: scroll;

  height: 100vh;

  background-image: url("background-image.jpg");
  background-repeat: repeat;

  display: flex;
  flex-direction: column;
  // justify-content: flex-start;
  /* align-items: center; */
`;

const StyledLogo = styled.img`
  padding: 1em;
  align-self: flex-start;
  // background-color: green;
  @media (max-height: ${mediaBreak}) {
    width: 6em;
    height: 6em;
  }
  @media (min-height: ${mediaBreak}) {
    width: 10em;
    height: 10em;
  }
`;

const Header = styled.div`
  // margin-bottom: 2em;
  align-self: flex-start;
`;

const Content = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;

  width: 25em;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  box-sizing: content-box;
  height: 30em;

  padding: 3em 0em;

  /* @media (max-height: ${mediaBreak}) {
    padding: 0em 0em;
  }
  @media (min-height: ${mediaBreak}) {
    padding: 3em 0em;
  } */
`;

const Footer = styled.div`
  position: fixed;
  background-color: ${colors.floor};
  color: white;
  bottom: 0px;
  width: 100%;
  height: 3em;
  display: grid;
  place-items: center;

  font-style: italic;
  //  min-width: 32em;
`;

const Anchor = styled.a`
  padding: 1.5em 2.4em;

  background-color: ${colors.coolBlue};

  font-size: 1em;

  color: white;

  border: none;

  margin: 0.5em 1em;

  text-decoration: none;

  border-radius: 2px;

  display: grid;
  place-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${colors.chairBlue};
  }

  &:not(.make-appointment-button) {
    background-color: #b79953;
  }

  &:not(.make-appointment-button):hover {
    background-color: ${colors.milGreen};
  }

  &.make-appointment-button {
    margin-bottom: 1.5em;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  padding-top: 2em;

  a {
    width: 14em;
  }

  hr {
    border: none;
    border-bottom: 1px solid black;
    height: 1em;
    width: 80%;
    margin: 1em 0em 2em 0em;
  }
`;

const Prices = ({ handleClick, className }: { handleClick: () => void; className?: string }) => {
  return (
    <div className={className}>
      <table className={"table"}>
        <tr className={"table-row"}>
          <td className={"label"}>HAIRCUT</td>
          <td className={"price"}>$21</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>KIDS</td>
          <td className={"price"}>$19</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>SENIOR</td>
          <td className={"price"}>$19</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>HEAD SHAVE</td>
          <td className={"price"}>$25</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>FACE SHAVE</td>
          <td className={"price"}>$29</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>BEARD TRIM</td>
          <td className={"price"}>$13</td>
        </tr>
        <tr className={"table-row"}>
          <td className={"label"}>HAIR & BEARD</td>
          <td className={"price"}>$28</td>
        </tr>
      </table>
      <div className={"note-items"}>
        <ul>
          <li>
            <span className={"cash-or-check"}>Cash or Check ONLY</span>
          </li>
          <li>
            <span className={"walk-ins"}>Walk ins accepted if time allows</span>
          </li>
        </ul>
      </div>
      <div className={"button-wrapper"}>
        <button onClick={() => handleClick()}>Close</button>
      </div>
    </div>
  );
};

const StyledPrices = styled(Prices)`
  color: black;
  display: flex;
  flex-direction: column;

  button {
    background: none;
    border: none;

    font-size: 1em;
  }

  button:hover {
    cursor: pointer;
  }

  .button-wrapper {
    padding-top: 2em;
    display: grid;
    place-items: center;
  }

  .table {
  }

  .table-row {
  }

  td {
    border-bottom: 1px solid black;
    padding-top: 0.8em;
  }

  .label {
    font-weight: bold;
    font-size: 1.3em;
    padding-bottom: 0.3em;
  }

  .price {
    color: ${colors.coolBlue};
    font-weight: bold;
    font-size: 1.3em;
  }

  .note-items {
    display: flex;
    flex-direction: column;
    font-size: 0.9em;
    align-self: flex-start;

    color: rgba(44, 44, 44, 1);
  }

  .cash-or-check {
    font-style: italic;
    font-weight: bold;
  }

  .walk-ins {
    font-style: italic;
    font-weight: bold;
  }
`;

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
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
      <IsMaintenance>Under maintenance! Will be back up by Tuesday morning</IsMaintenance>

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
