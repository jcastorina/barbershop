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
    return await fetch(`${process.env.REACT_APP_URL}/loginAdmin`, {
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

const SaveButton = styled.button<{ isCheckForm: boolean }>`
  height: 3em;
  width: 9em;
  align-self: center;
  margin-top: 8em;
  border: 1px solid grey;
  border-radius: 2px;
  background-color: ${(props) => (props.isCheckForm ? "default;" : "#5BF563;")};
`;

const getTodayAppts = async () => {
  try {
    const result = await fetch(`${process.env.REACT_APP_URL}/adminTodayAppts`);
    const string = await result.text();
    const todayAppts = JSON.parse(string);
    return todayAppts;
  } catch (e) {
    return [];
  }
};

const getTomorrowAppts = async () => {
  try {
    const result = await fetch(`${process.env.REACT_APP_URL}/adminTomorrowAppts`);
    const string = await result.text();
    const todayAppts = JSON.parse(string);
    return todayAppts;
  } catch (e) {
    return [];
  }
};

const formatPhoneNumber = (string: string) => {
  if (string.length === 10) {
    return `${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 10)}`;
  }
};

const Appointment = ({
  appointment,
  className,
}: {
  appointment: IAppointmentRecord;
  className?: string;
}) => {
  return (
    <div className={className}>
      <div className={"column"}>
        <span>Name: </span>
        <span>Phone: </span>
        <span>Time: </span>
      </div>
      <div className={"column item"}>
        <div>{appointment.name}</div>
        <div>{formatPhoneNumber(appointment.phone)}</div>
        <div>{appointment.time}</div>
      </div>
    </div>
  );
};

const StyledAppointment = styled(Appointment)`
  display: flex;
  flex-direction: row;

  .column {
    display: flex;
    flex-direction: column;
    margin: 1em;

    div,
    span {
      margin: 0.3em;
    }

    div {
      font-weight: bold;
    }
  }
`;

const Selector = ({
  canBack,
  canForward,
  setIndex,
  className,
}: {
  canBack: boolean;
  canForward: boolean;
  setIndex: (index: number | ((index: number) => number)) => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <span
        className={canBack ? "enabled" : ""}
        onClick={() => {
          if (canBack) {
            setIndex((index) => index - 1);
          }
        }}
      >
        {"<"}
      </span>
      <span
        className={canForward ? "enabled" : ""}
        onClick={() => {
          if (canForward) {
            setIndex((index) => index + 1);
          }
        }}
      >
        {">"}
      </span>
    </div>
  );
};

const StyledSelector = styled(Selector)`
  width: 10em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-left: 3em;

  span {
    font-size: 2em;
    font-weight: bold;
    color: lightgray;
  }
  .enabled {
    color: black;
    cursor: pointer;
  }
`;

const AppointmentView = ({
  day,
  setShow,
  className,
}: {
  day: "Today" | "Tomorrow";
  setShow: (show: boolean) => void;
  className?: string;
}) => {
  const [appts, setAppts] = useState<IAppointmentRecord[] | [] | null>(null);

  useEffect(() => {
    if (day === "Today") {
      getTodayAppts().then((appts) => setAppts(appts));
    } else if (day === "Tomorrow") {
      getTomorrowAppts().then((appts) => setAppts(appts));
    }
  }, [day]);

  const [index, setIndex] = useState(0);

  const canBack = appts?.length && index > 0 ? true : false;
  const canForward = appts?.length && index < appts.length - 1 ? true : false;

  return (
    <div className={className}>
      <h2>{day}'s&nbsp;Appointments</h2>
      {appts && appts.length > 0 && (
        <>
          <StyledAppointment appointment={appts[index]} />
          <StyledSelector canBack={canBack} canForward={canForward} setIndex={setIndex} />
        </>
      )}
      {appts && appts.length === 0 && (
        <div className={"no-appointments"}>No appointments to show!</div>
      )}
      <button
        className={"close-button"}
        onClick={() => {
          setShow(false);
        }}
      >
        Close
      </button>
    </div>
  );
};

const StyledAppointmentView = styled(AppointmentView)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  background-color: white;

  h2 {
    margin-left: 1em;
  }

  .no-appointments {
    font-size: 18px;

    height: 15em;

    margin-left: 5em;
    margin-top: 3em;
  }

  .close-button {
    margin-left: 8em;

    width: 5.5em;
    height: 2.5em;
  }
`;

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
  const [selected] = useState("");

  // const [employees, setEmployees] = useState(["Mitch"]);

  // if i type in a closing hour after 6pm, it changes to 6pm onBlur
  // if i type in a closing hour before the opening hour, it changes to the opening hour onblur
  // when i click closed, it simply disables the inputs
  // do a validation check for the isDisabled flag that asserts these rules

  const [todayOpen, setTodayOpen] = useState<number>(8);
  const [todayClosed, setTodayClosed] = useState<number>(17);
  const [tomorrowOpen, setTomorrowOpen] = useState<number>(8);
  const [tomorrowClosed, setTomorrowClosed] = useState<number>(17);
  const [isTodayClosed, setIsTodayClosed] = useState(false);
  const [isTomorrowClosed, setIsTomorrowClosed] = useState(false);

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

      const adminResult = await fetch(`${process.env.REACT_APP_URL}/adminObject`);
      const adminObjectJSON = await adminResult.text();
      const adminObject = JSON.parse(adminObjectJSON) as ISchedule;

      if (adminObject.Today.hours === null) {
        setIsTodayClosed(true);
      } else {
        if (adminObject.Today.hours.length === 2) {
          const hours = adminObject.Today.hours;
          setTodayOpen(hours[0]);
          setTodayClosed(hours[1]);
        }
      }
      if (adminObject.Tomorrow.hours === null) {
        setIsTomorrowClosed(true);
      } else {
        if (adminObject.Tomorrow.hours.length === 2) {
          const hours = adminObject.Tomorrow.hours;
          setTomorrowOpen(hours[0]);
          setTomorrowClosed(hours[1]);
        }
      }
    })();
  }, []);

  const [isCheckForm, setIsCheckForm] = useState(true);

  const handleSave = async () => {
    const Today = { hours: isTodayClosed ? null : [todayOpen, todayClosed] };
    const Tomorrow = { hours: isTomorrowClosed ? null : [tomorrowOpen, tomorrowClosed] };

    const request = JSON.stringify({ Today, Tomorrow });

    setIsCheckForm(true);

    try {
      await fetch(`${process.env.REACT_APP_URL}/adminUpdateSchedule`, {
        method: "post",
        body: request,
      });
    } catch (e) {
    } finally {
    }
  };

  const handleFocus = () => {
    setIsCheckForm(true);
  };

  const [isTodayAppointmentView, setIsTodayAppointmentView] = useState(false);
  const [isTomorrowAppointmentView, setIsTomorrowAppointmentView] = useState(false);

  return (
    <Container className={className}>
      <Fog show={showModal} />
      {showModal && (
        <StyledModal employee={selected} show={showModal} setShowModal={setShowModal} />
      )}
      {isTodayAppointmentView && (
        <StyledAppointmentView day={"Today"} setShow={setIsTodayAppointmentView} />
      )}
      {isTomorrowAppointmentView && (
        <StyledAppointmentView day={"Tomorrow"} setShow={setIsTomorrowAppointmentView} />
      )}
      <div className="group-container">
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
                disabled={isTodayClosed}
                type={"number"}
                value={todayOpen}
                onChange={(e) => {
                  setIsCheckForm(true);
                  const value = parseInt(e.target.value);

                  setTodayOpen(value);
                }}
                onBlur={handleTodayOpenBlur}
                onFocus={handleFocus}
              />
              <input
                disabled={isTodayClosed}
                type={"number"}
                value={todayClosed}
                onChange={(e) => {
                  setIsCheckForm(true);
                  const value = parseInt(e.target.value);

                  setTodayClosed(value);
                }}
                onBlur={handleTodayCloseBlur}
                onFocus={handleFocus}
              />
              <input
                checked={isTodayClosed}
                type="checkbox"
                onChange={(e) => {
                  setIsCheckForm(true);
                  setIsTodayClosed(Boolean(e.target.checked));
                }}
                value={Boolean(isTodayClosed) ? "on" : "off"}
                onFocus={handleFocus}
              />
            </div>
          </div>
          <div>
            Tomorrow:
            <div>
              <input
                disabled={isTomorrowClosed}
                type={"number"}
                value={tomorrowOpen}
                onChange={(e) => {
                  setIsCheckForm(true);
                  const value = parseInt(e.target.value);

                  setTomorrowOpen(value);
                }}
                onBlur={handleTomorrowOpenBlur}
                onFocus={handleFocus}
              />
              <input
                disabled={isTomorrowClosed}
                type={"number"}
                value={tomorrowClosed}
                onChange={(e) => {
                  setIsCheckForm(true);
                  const value = parseInt(e.target.value);

                  setTomorrowClosed(value);
                }}
                onBlur={handleTomorrowCloseBlur}
                onFocus={handleFocus}
              />
              <input
                checked={isTomorrowClosed}
                type="checkbox"
                onChange={(e) => {
                  setIsCheckForm(true);
                  setIsTomorrowClosed(Boolean(e.target.checked));
                }}
                onFocus={handleFocus}
              />
            </div>
          </div>
          <SaveButton
            isCheckForm={isCheckForm}
            onClick={async () => {
              if (!isCheckForm) {
                await handleSave();
              } else {
                setIsCheckForm(false);
              }
            }}
          >
            {isCheckForm ? "Check Form" : "Save?"}
          </SaveButton>
        </div>
      </div>
      <div className="group-container">
        <h2>View Appointments</h2>
        <div className="hours-container">
          <div>
            <span>Today's: </span>
            <div>
              <button
                onClick={() => {
                  // console.log("clicked");
                  // const today = await getTodayAppts();
                  // setTodayAppts(today);
                  setIsTodayAppointmentView(true);
                }}
              >
                Today
              </button>
            </div>
          </div>
          <br />
          <div>
            <span>Tomorrow's: </span>
            <div>
              <button
                onClick={async () => {
                  // const tomorrow = await getTomorrowAppts();
                  // setTomorrowAppts(tomorrow);
                  setIsTomorrowAppointmentView(true);
                }}
              >
                Tomorrow
              </button>
            </div>
          </div>
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
            // disabled={employees.length > 4}
          />
          <button
          // disabled={!addEmployee || employees.length > 4}
          // onClick={async () => {
          //   if (addEmployee) {
          //     const result = await fetch("http://127.0.0.2:3001/addEmployee", {
          //       method: "post",
          //       headers: { "Content-Type": "text/plain" },
          //       body: addEmployee,
          //     });
          //     const text = await result.text();
          //     setAddEmployee("");
          //   }
          // }}
          >
            Add
          </button>
        </span>
        {/* {employees.length
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
          : "No employees found"} */}
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
    /* border: 1px solid pink; */
  }

  .group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0em 3em;
    height: 30em;
    width: 18em;

    /* border: 1px solid green; */
  }

  .hours-container {
    display: flex;
    flex-direction: column;
    //  align-items: center;
    justify-content: flex-start;
    // margin: 3em;
    // height: 20em;
    width: 18em;

    /* border: 1px solid red; */

    div {
      /* margin-left: 2em;
      margin-right: 1em; */
      //width: 12em;
      display: flex;
      flex-direction: row;

      justify-content: space-between;

      input {
        width: 3em;
      }

      button {
        width: 6.5em;
        height: 2.5em;

        margin: 0;
      }
    }
  }

  button {
    margin: 1em 1em 0em;
  }
`;
