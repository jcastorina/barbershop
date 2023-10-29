import { useState, useEffect } from "react";
import styled from "styled-components";

import { StyledAdminLoggedIn, StyledAdminLoginView } from "./Admin";
import { Calendar } from "./Calendar";

const colors = {
  hotRed: "#ee1045",
  rusticRed: "#dd221b",
  milGreen: "#c8c7b5",
  coolBlue: "#03a1fb",
  chairBlue: "#87b5e3",
  floor: "#af8f71",
};

const ColorsContainer = styled.div<{ show: boolean }>`
  z-index: ${(props) => (props.show ? "50" : "-1")};
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  border: 1px solid gray;
  top: 200px;
  left: 2px;
  height: 30vh;
  width: 50vw;
`;

const Circle = styled.div<{ color: string }>`
  border-radius: 32px;
  background-color: ${(props) => props.color};
  height: 1em;
  width: 1em;
  display: inline-block;
`;

const RowItem = styled.div`
  // border: 1px solid green;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyleGuideButton = styled.button`
  color: white;
  height: 3em;
  width: 3em;
  border-radius: 32px;
  background-color: ${colors.coolBlue};
  position: absolute;
  z-index: 50;
  bottom: 10%;
  right: 10%;
`;

const StyledLogo = styled.img`
  width: 14em;
  height: 14em;
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
  const [selectedBarber, setSelectedBarber] = useState("Mitch");
  const [selectedDay, setSelectedDay] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminLoginView, setAdminLoginView] = useState(false);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/employees");
      const text = await result.text();
      const employees = JSON.parse(text);
      if (typeof employees === "object") {
        setEmployees(employees);
      }
    })();
  }, [needsUpdate]);

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
        setNeedsUpdate={setNeedsUpdate}
        employees={employees}
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
      <ColorsContainer show={showColors}>
        <div>Colors</div>
        <RowItem>
          Hot Red:{"  "} <Circle color={"#ee1045"} />
        </RowItem>
        <RowItem>
          Rustic Red:{"  "} <Circle color={"#dd221b"} />
        </RowItem>
        <RowItem>
          Mil Green:{"  "} <Circle color={"#c8c7b5"} />
        </RowItem>
        <RowItem>
          Cool Blue:{"  "} <Circle color={"#03a1fb"} />
        </RowItem>
        <RowItem>
          Chair Blue:{"  "} <Circle color={"#87b5e3"} />
        </RowItem>
        <RowItem>
          Floor:{"  "} <Circle color={"#af8f71"} />
        </RowItem>
      </ColorsContainer>
      <Header>
        <StyledLogo src={"main-logo.jpg"} alt={"Jefferson Street Barber Shop"}></StyledLogo>
      </Header>

      <Content>
        <Calendar
          selectedBarber={selectedBarber}
          setSelectedBarber={setSelectedBarber}
          employees={employees}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </Content>
      <Footer>Footer Content</Footer>
      <StyleGuideButton onClick={() => setShowColors((c) => !c)} />
    </>
  );
}

export default App;
