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
            window.history.pushState(null, "", "/");
            setAdminLoginView(false);
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

const StyledAdminLoginView = styled(AdminLoginView)`
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

function AdminView({
  addEmployee,
  setAddEmployee,
  setNeedsUpdate,
  deleteEmployee,
  setDeleteEmployee,
  className,
}: {
  addEmployee: string;
  deleteEmployee: string;
  setAddEmployee: (e: string) => void;
  setDeleteEmployee: (e: string) => void;
  setNeedsUpdate: (e: (u: boolean) => boolean) => void;
  className: string;
}) {
  return (
    <div className={className}>
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
        />
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
    </div>
  );
}

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
  opacity: 0.8;
  background-color: white;
  display: ${(props) => (props.show ? "flex" : "none")};
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 2em;

  button {
    margin: 0.5em;
    padding: 0.5em 1em;
  }

  button:hover {
    cursor: pointer;
  }
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
      {showModal && (
        <StyledModal
          employee={selected}
          show={showModal}
          setShowModal={setShowModal}
          setNeedsUpdate={setNeedsUpdate}
        />
      )}
      <button
        onClick={() => {
          setAdminLoggedIn(false);
          setAdminLoginView(false);
          window.history.pushState(null, "", "/");
        }}
      >
        Go Back
      </button>
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
    </div>
  );
}

const StyledAdminLoggedIn = styled(AdminLoggedIn)`
  height: 100vh;
  width: 100vw;
  background-color: green;
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
  const [adminLoginView, setAdminLoginView] = useState(false);

  useEffect(() => {
    console.log("setting new employee");
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/employees");
      const text = await result.text();
      const employees = JSON.parse(text);
      console.log(employees, "employees");
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
      setAdminLoginView(true);
    } else {
      //   window.location.pathname = "/";
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
    <Wrapper>
      <WidgetContainer>
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
