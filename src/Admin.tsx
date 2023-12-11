import { useState, useEffect, useRef } from "react";
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
        // onClick={async () => {
        //   try {
        //     const result = await fetch("http://127.0.0.1:3001/deleteEmployee", {
        //       method: "post",
        //       headers: { "Content-Type": "text/plain" },
        //       body: employee,
        //     });
        //     const text = await result.text();
        //     console.log(text, "running set need supdate");
        //     // setNeedsUpdate((u) => !u);
        //     console.log(text);
        //   } catch (e) {
        //     console.log("No employee found!");
        //   } finally {
        //     console.log("trying to update in finally block");
        //     setShowModal(false);
        //   }
        // }}
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// const hours = ((start, end) => {
//   let hours = [];

//   for (let i = start; i < end; i++) {
//     hours.push(i);
//   }

//   return hours;
// })(8, 18);

type IDays = "Today" | "Tomorrow";

type IAppointmentRecord = {
  name: string;
  time: string;
  barber: string;
  day: string;
  phone: string;
};

type IDaySchedule = {
  hours: number[] | null;
  appts: IAppointmentRecord[] | never[];
};

type ISchedule = Record<IDays, IDaySchedule>;

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

  const [employees, setEmployees] = useState(["Mitch"]);
  const [adminObject, setAdminObject] = useState<ISchedule | null>(null);

  const [todayHours, setTodayHours] = useState<number[] | never[] | null>(null);
  const [tomorrowHours, setTomorrowHours] = useState<number[] | never[] | null>(null);

  const [isDirty, setIsDirty] = useState(false);

  // useEffect(() => {}, [isClosedToday, isClosedTomorrow, todayHours, tomorrowHours]);

  // if i type in a closing hour after 6pm, it changes to 6pm onBlur
  // if i type in a closing hour before the opening hour, it changes to the opening hour onblur
  // when i click closed, it simply disables the inputs
  // do a validation check for the isDisabled flag that asserts these rules

  const [todayOpen, setTodayOpen] = useState<number | null>(null);
  const [todayClosed, setTodayClosed] = useState<number | null>(null);
  const [tomorrowOpen, setTomorrowOpen] = useState<number | null>(null);
  const [tomorrowClosed, setTomorrowClosed] = useState<number | null>(null);
  const [isClosedToday, setIsClosedToday] = useState(false);
  const [isClosedTomorrow, setIsClosedTomorrow] = useState(false);

  const handleTodayOpenBlur = () => {
    if (todayOpen && todayOpen < 8) {
      setTodayOpen(8);
    }
    if (todayOpen && todayClosed && todayOpen > todayClosed) {
      setTodayOpen(todayClosed);
    }
  };
  const handleTodayCloseBlur = () => {
    if (todayClosed && todayClosed > 17) {
      setTodayClosed(17);
    }
    if (todayClosed && todayOpen && todayClosed < todayOpen) {
      setTodayClosed(todayOpen);
    }
  };

  const handleTomorrowOpenBlur = () => {
    if (tomorrowOpen && tomorrowOpen < 8) {
      setTomorrowOpen(8);
    }
    if (tomorrowOpen && tomorrowClosed && tomorrowOpen > tomorrowClosed) {
      setTomorrowOpen(tomorrowClosed);
    }
  };
  const handleTomorrowCloseBlur = () => {
    if (tomorrowClosed && tomorrowClosed > 17) {
      setTomorrowClosed(17);
    }
    if (tomorrowClosed && tomorrowOpen && tomorrowClosed < tomorrowOpen) {
      setTomorrowClosed(tomorrowOpen);
    }
  };

  useEffect(() => {
    (async () => {
      // const result = await fetch("http://127.0.0.1:3001/employees");
      // const text = await result.text();
      // const employees = JSON.parse(text);
      // if (typeof employees === "object") {
      //   setEmployees(employees);
      // }

      const adminResult = await fetch("http://127.0.0.1:3001/adminObject");
      const adminObjectJSON = await adminResult.text();
      const adminObject = JSON.parse(adminObjectJSON) as ISchedule;
      setAdminObject(adminObject);
      console.log(adminObject, "dmin");
      if (adminObject.Today.hours === null) {
        setIsClosedToday(true);
      } else {
        setTodayHours(adminObject.Today.hours);
        if (adminObject.Today.hours.length === 2) {
          const hours = adminObject.Today.hours;
          setTodayOpen(hours[0]);
          setTodayClosed(hours[0]);
        }
      }
      if (adminObject.Tomorrow.hours === null) {
        setIsClosedTomorrow(true);
        console.log("null path tomorrow");
      } else {
        setTomorrowHours(adminObject.Tomorrow.hours);
        if (adminObject.Tomorrow.hours.length === 2) {
          const hours = adminObject.Tomorrow.hours;
          setTodayOpen(hours[0]);
          setTodayClosed(hours[0]);
        }
      }
    })();
  }, []);

  return (
    <Container className={className}>
      <Fog show={showModal} />
      {showModal && (
        <StyledModal employee={selected} show={showModal} setShowModal={setShowModal} />
      )}

      <Container className="group-container">
        <h2>Schedule</h2>
        <div className={"hours-container"}>
          <div>
            <span>Day:</span>
            <span>Closed?</span>
          </div>
          <br />
          <div>
            Today:
            <div>
              <input
                disabled={isClosedToday}
                type={"number"}
                value={todayOpen ?? 8}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setTodayOpen(value);
                }}
                onBlur={handleTodayOpenBlur}
              />
              <input
                disabled={isClosedToday}
                type={"number"}
                value={todayClosed ?? 17}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setTodayClosed(value);
                }}
                onBlur={handleTodayCloseBlur}
              />
              <input
                checked={isClosedToday}
                type="checkbox"
                onChange={(e) => setIsClosedToday(Boolean(e.target.checked))}
                value={Boolean(isClosedToday) ? "on" : "off"}
              />
            </div>
          </div>
          <div>
            Tomorrow:
            <div>
              <input
                disabled={isClosedTomorrow}
                type={"number"}
                value={tomorrowOpen ?? 8}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setTomorrowOpen(value);
                }}
                onBlur={handleTomorrowOpenBlur}
              />
              <input
                disabled={isClosedTomorrow}
                type={"number"}
                value={tomorrowClosed ?? 17}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setTomorrowClosed(value);
                }}
                onBlur={handleTomorrowCloseBlur}
              />
              <input
                checked={isClosedTomorrow}
                type="checkbox"
                onChange={(e) => setIsClosedTomorrow(Boolean(e.target.checked))}
              />
            </div>
          </div>
          <button disabled={!isDirty}>Save?</button>
        </div>
      </Container>
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
    </Container>
  );
}

export const StyledAdminLoggedIn = styled(AdminLoggedIn)`
  height: 100vh;
  width: 100vw;
  display: flex;
  /* flex-direction: row;
  align-items: center;
  justify-content: center; */

  h2 {
    width: 10em;
    border: 1px solid pink;
  }

  .group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 3em;
    height: 30em;
    width: 18em;

    border: 1px solid green;
  }

  .hours-container {
    display: flex;
    flex-direction: column;
    //  align-items: center;
    justify-content: flex-start;
    // margin: 3em;
    height: 30em;
    width: 18em;

    border: 1px solid red;

    div {
      margin-left: 2em;
      margin-right: 1em;
      //width: 12em;
      display: flex;
      flex-direction: row;

      justify-content: space-between;

      input {
        width: 2em;
      }
    }
  }

  button {
    margin: 1em 1em 0em;
  }
`;
