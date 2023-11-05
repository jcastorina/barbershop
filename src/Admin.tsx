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

export const StyledAdminLoginView = styled(AdminLoginView)`
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
  className,
}: {
  employee: string;
  setShowModal: (u: boolean) => void;
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

const hours = ((start, end) => {
  let hours = [];

  for (let i = start; i < end; i++) {
    hours.push(i);
  }

  return hours;
})(8, 18);

function AdminLoggedIn({
  setAdminLoggedIn,
  setAdminLoginView,
  // setNeedsUpdate,
  className,
}: {
  setAdminLoggedIn: (u: boolean) => void;
  setAdminLoginView: (u: boolean) => void;
  // employees: string[];
  // setNeedsUpdate: (c: (u: boolean) => boolean) => void;
  className?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [addEmployee, setAddEmployee] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedStartHour, setSelectedStartHour] = useState(hours[0]);
  const [selectedEndHour, setSelectedEndHour] = useState(hours[hours.length - 1]);
  const [employees, setEmployees] = useState(["Mitch"]);

  console.log(selectedStartHour, selectedEndHour);

  useEffect(() => {
    (async () => {
      const result = await fetch("http://127.0.0.1:3001/employees");
      const text = await result.text();
      const employees = JSON.parse(text);
      if (typeof employees === "object") {
        setEmployees(employees);
      }
    })();
  }, []);

  return (
    <div className={className}>
      <Fog show={showModal} />
      {showModal && (
        <StyledModal employee={selected} show={showModal} setShowModal={setShowModal} />
      )}
      <div className="group-container">
        <h2>Times</h2>
        <div>
          Start Time:{" "}
          <select
            onChange={(e) => {
              setSelectedStartHour(parseInt(e.target.value));
            }}
          >
            {hours.map((hour) => {
              hour = hour > 12 ? hour - 12 : hour;
              return <option value={hour}>{hour}</option>;
            })}
          </select>
        </div>
        <div>
          End Time:{" "}
          <select
            onChange={(e) => {
              setSelectedEndHour(parseInt(e.target.value));
            }}
          >
            {hours.slice(hours.indexOf(selectedStartHour)).map((hour) => {
              hour = hour > 12 ? hour - 12 : hour;
              return <option value={hour}>{hour}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="group-container">
        <h2>Roster</h2>
        <span>
          <input
            placeholder="employee name"
            value={addEmployee}
            onChange={(e) => setAddEmployee(e.target.value)}
            style={{ marginBottom: "1.3em" }}
            disabled={employees.length > 4}
          />
          <button
            disabled={!addEmployee || employees.length > 4}
            onClick={async () => {
              if (addEmployee) {
                const result = await fetch("http://127.0.0.2:3001/addEmployee", {
                  method: "post",
                  headers: { "Content-Type": "text/plain" },
                  body: addEmployee,
                });
                const text = await result.text();
                setAddEmployee("");
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
                <b>
                  <i>{employee}</i>
                </b>
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
    </div>
  );
}

export const StyledAdminLoggedIn = styled(AdminLoggedIn)`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  h2 {
    width: 10em;
  }

  .group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 3em;
    height: 30em;
    width: 18em;
    border: 1px solid black;
  }

  button {
    margin: 1em 1em 0em;
  }
`;
