import { useState, useEffect } from "react";
import styled from "styled-components";

function AdminLoginView({
  password,
  setPassword,
  setAdminLoggedIn,
  setAdminLoginView,
  className,
}: {
  password: string;
  setPassword: (e: any) => void;
  setAdminLoggedIn: (e: any) => void;
  setAdminLoginView: (e: any) => void;
  className?: string;
}) {
  async function submitLogin() {
    return await fetch("http://127.0.0.1:3001/loginAdmin", {
      method: "post",
      headers: { "Content-Type": "text/plain" },
      body: password,
    });
  }

  return (
    <div
      className={className}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          const response = await submitLogin();

          if (response.ok) {
            setAdminLoggedIn(true);
          }
        }
      }}
    >
      <div className="admin-wrapper">
        <div>
          <input
            type="password"
            value={password}
            placeholder="Enter Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="login-button"
            onClick={async () => {
              const response = await submitLogin();

              if (response.ok) {
                setAdminLoggedIn(true);
              }
            }}
          >
            Login
          </button>
        </div>

        <button
          className="go-back"
          onClick={() => {
            setPassword("");
            window.history.pushState(null, "", "/");
            setAdminLoginView(false);
          }}
        >
          Go Back To Calendar
        </button>
      </div>
    </div>
  );
}

const StyledAdminLoginView = styled(AdminLoginView)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100vh;
  width: 100vw;

  .admin-wrapper {
    display: flex;
    flex-direction: column;
  }

  input {
    width: 16em;
    padding: 0.8em;
  }

  .go-back {
    align-self: center;
    width: 8em;
    margin-top: 2em;
  }

  .login-button {
    margin-left: 1em;
    padding: 0.8em;
  }

  button:hover {
    cursor: pointer;
  }
`;

function Modal({
  employee,
  setShowModal,
  setNeedsUpdate,
  className,
}: {
  employee: string;
  setShowModal: (u: boolean) => void;
  setNeedsUpdate: (u: (c: boolean) => boolean) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <span>Delete {employee}?</span>
      <div>
        <button
          onClick={async () => {
            try {
              const result = await fetch("http://127.0.0.1:3001/deleteEmployee", {
                method: "post",
                headers: { "Content-Type": "text/plain" },
                body: employee,
              });
              const text = await result.text();
              console.log(text, "running set need supdate");
              // setNeedsUpdate((u) => !u);
              console.log(text);
            } catch (e) {
              console.log("No employee found!");
            } finally {
              console.log("trying to update in finally block");
              setNeedsUpdate((u) => !u);
              setShowModal(false);
            }
          }}
        >
          Yes
        </button>

        <button
          onClick={async () => {
            setShowModal(false);
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}

const StyledModal = styled(Modal)<{ show: boolean }>`
  position: absolute;

  z-index: 2;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 2em;

  button {
    margin: 0.5em;
    padding: 0.5em 1em;
    opacity: 1;
  }

  button:hover {
    cursor: pointer;
  }
`;

const Fog = styled.div<{ show: boolean }>`
  opacity: 0.8;
  background-color: white;
  display: ${(props) => (props.show ? "flex" : "none")};
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
`;

function AdminLoggedIn({
  setAdminLoggedIn,
  setAdminLoginView,
  employees,
  setNeedsUpdate,
  className,
}: {
  setAdminLoggedIn: (u: boolean) => void;
  setAdminLoginView: (u: boolean) => void;
  employees: string[];
  setNeedsUpdate: (c: (u: boolean) => boolean) => void;
  className?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [addEmployee, setAddEmployee] = useState("");
  const [selected, setSelected] = useState("");

  return (
    <div className={className}>
      <Fog show={showModal} />
      {showModal && (
        <StyledModal
          employee={selected}
          show={showModal}
          setShowModal={setShowModal}
          setNeedsUpdate={setNeedsUpdate}
        />
      )}

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
      {employees.length
        ? employees.map((employee) => (
            <div>
              <span>{employee}</span>
              <button
                onClick={async () => {
                  setSelected(employee);
                  setShowModal(true);
                }}
              >
                Delete Employee
              </button>
            </div>
          ))
        : "No employees found"}
      <br />
      <br />
      <button
        onClick={() => {
          setAdminLoggedIn(false);
          setAdminLoginView(false);
          window.history.pushState(null, "", "/");
        }}
      >
        Go Back To Calendar
      </button>
    </div>
  );
}

const StyledAdminLoggedIn = styled(AdminLoggedIn)`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    margin: 1em 1em 0em;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgb(244, 244, 244);
  display: grid;
  place-items: center;
`;

const DayButton = styled.button<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "white" : "rgb(222,222,222)")};
  height: 3em;
  width: 6em;

  position: relative;
  top: 2px;

  box-sizing: content-box;

  border-bottom: 1px solid ${(props) => (props.selected ? "white" : "black")};
  border-radius: 8px 8px 0px 0px;

  &:hover {
    cursor: pointer;
  }
`;

const EmployeeButton = styled.button<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "white" : "rgb(222,222,222)")};
  height: 3em;
  width: 6em;

  margin: 1em;

  border-radius: 8px;
  box-shadow: black 1px 1px 1px;

  &:hover {
    cursor: pointer;
  }
`;

const DayButtonContainer = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: row;
`;

const EmployeeContainer = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: row;
`;

const CalendarContainer = styled.div`
  background-color: white;
  border: 2px solid black;
  box-shadow: 4px 4px 6px rgba(100, 100, 100, 0.5);

  border-radius: 0px 8px 8px 8px;
  width: 33vw;
  height: 50vh;
`;

const WidgetContainer = styled.div`
  padding: 2em;
  display: flex;
  flex-direction: column;
`;

const day = ["Today", "Tomorrow"];

function Calendar({
  employees,
  selectedBarber,
  setSelectedBarber,
  selectedDay,
  setSelectedDay,
}: {
  employees: string[];
  selectedBarber: string;
  setSelectedBarber: (c: string) => void;
  selectedDay: string;
  setSelectedDay: (c: string) => void;
}) {
  return (
    <Wrapper>
      <WidgetContainer>
        <DayButtonContainer>
          {day.map((day) => (
            <DayButton onClick={() => setSelectedDay(day)} selected={selectedDay === day}>
              {day}
            </DayButton>
          ))}
        </DayButtonContainer>

        <CalendarContainer>
          <EmployeeContainer>
            {employees.map((employee) => (
              <EmployeeButton
                onClick={() => setSelectedBarber(employee)}
                selected={selectedBarber === employee}
              >
                {employee}
              </EmployeeButton>
            ))}
          </EmployeeContainer>
        </CalendarContainer>
      </WidgetContainer>
    </Wrapper>
  );
}

function App() {
  const [selectedBarber, setSelectedBarber] = useState("Mitch");
  const [selectedDay, setSelectedDay] = useState("Today");
  const [employees, setEmployees] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminLoginView, setAdminLoginView] = useState(false);

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
    <Calendar
      selectedBarber={selectedBarber}
      setSelectedBarber={setSelectedBarber}
      employees={employees}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
    />
  );
}

export default App;
