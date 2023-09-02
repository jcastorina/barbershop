import { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: grid;
  place-items: center;
  border: 1px solid red;
`;

const Selector = styled.button<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "green" : "lightgreen")};
  height: 3em;
  width: 6em;
  border: 1px solid pink;
`;

const SelectorContainer = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: row;
  border: 1px solid red;
`;

const CalendarContainer = styled.div``;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid yellow;
`;

function AdminView({
  password,
  setPassword,
  setAdminLoggedIn,
  setAdminView,
  className,
}: {
  password: string;
  setPassword: (e: any) => void;
  setAdminLoggedIn: (e: any) => void;
  setAdminView: (e: any) => void;
  className?: string;
}) {
  return (
    <div
      className={className}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          const response = await fetch("http://127.0.0.1:3001/loginAdmin", {
            method: "post",
            headers: { "Content-Type": "text/plain" },
            body: password,
          });

          if (response.ok) {
            setAdminLoggedIn(true);
          }
        }
      }}
    >
      <div className="admin-wrapper">
        <input
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          onClick={() => {
            setPassword("");
            window.location.pathname = "/";
            setAdminView(false);
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

const StyledAdminView = styled(AdminView)`
  display: grid;
  place-items: center;

  height: 100vh;
  width: 100vw;
  background-color: yellow;

  .admin-wrapper {
    display: flex;
    flex-direction: column;
  }

  input {
    width: 16em;
    padding: 0.8em;
  }

  button {
    align-self: flex-end;
    width: 3.2em;
    margin-top: 1em;
    &:hover {
      cursor: pointer;
    }
  }
`;

const day = ["Today", "Tomorrow"];

function App() {
  const [selectedBarber, setSelectedBarber] = useState("Mitch");
  const [selectedDay, setSelectedDay] = useState("Today");
  const [addEmployee, setAddEmployee] = useState("");
  const [deleteEmployee, setDeleteEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminView, setAdminView] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/employees");
      const text = await result.text();
      const employees = JSON.parse(text);
      console.log(employees);
      if (typeof employees === "object") {
        setEmployees(employees);
      }
    })();
  }, [needsUpdate]);

  useEffect(() => {
    const pathname = window.location.pathname;
    console.log(pathname, "pathname");

    if (pathname === "/admin") {
      console.log("admin");
      setAdminView(true);
    }
  }, []);

  if (adminView) {
    return (
      <StyledAdminView
        password={password}
        setPassword={setPassword}
        setAdminLoggedIn={setAdminLoggedIn}
        setAdminView={setAdminView}
      />
    );
  }

  return (
    <Wrapper>
      <WidgetContainer>
        <span>
          <input
            placeholder="employee name"
            value={addEmployee}
            onChange={(e) => setAddEmployee(e.target.value)}
          />
          <button
            disabled={!addEmployee}
            onClick={async () => {
              if (addEmployee) {
                const result = await fetch("http://127.0.0.1:3001/addEmployee", {
                  method: "post",
                  headers: { "Content-Type": "text/plain" },
                  body: addEmployee,
                });
                const text = await result.text();
                setAddEmployee("");
                setNeedsUpdate((u) => !u);
                console.log(text);
              }
            }}
          >
            Add
          </button>
        </span>
        <span>
          <input
            placeholder="employee name"
            value={deleteEmployee}
            onChange={(e) => setDeleteEmployee(e.target.value)}
          />{" "}
          <button
            disabled={!deleteEmployee}
            onClick={async () => {
              if (deleteEmployee) {
                try {
                  const result = await fetch("http://127.0.0.1:3001/deleteEmployee", {
                    method: "post",
                    headers: { "Content-Type": "text/plain" },
                    body: deleteEmployee,
                  });
                  const text = await result.text();
                  setDeleteEmployee("");
                  setNeedsUpdate((u) => !u);
                  console.log(text);
                } catch (e) {
                  console.log("No employee found!");
                }
              }
            }}
          >
            Delete
          </button>
        </span>
        <SelectorContainer>
          {employees.map((employee) => (
            <Selector
              onClick={() => setSelectedBarber(employee)}
              selected={selectedBarber === employee}
            >
              {employee}
            </Selector>
          ))}
        </SelectorContainer>
        <SelectorContainer>
          {day.map((day) => (
            <Selector onClick={() => setSelectedDay(day)} selected={selectedDay === day}>
              {day}
            </Selector>
          ))}
        </SelectorContainer>
        <CalendarContainer></CalendarContainer>
      </WidgetContainer>
    </Wrapper>
  );
}

export default App;
