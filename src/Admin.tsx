import { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import { EmployeeRoster } from "./components/admin";

const tz = process.env.TZ || "America/Chicago";

const getDayOffset = (day: IDay) => parseInt(day.replace("day", ""), 10);

const sortDays = (days: IDays) => [...days].sort((a, b) => getDayOffset(a) - getDayOffset(b));

const getDayLabel = (day: IDay) => {
  const offset = getDayOffset(day);
  const dateLabel = moment().tz(tz).add(offset, "days").format("M/D");

  if (offset === 0) {
    return `Today - ${dateLabel}`;
  }

  if (offset === 1) {
    return `Tomorrow - ${dateLabel}`;
  }

  return `${moment().tz(tz).add(offset, "days").format("dddd")} - ${dateLabel}`;
};

type IDayConfig = {
  open: number;
  closed: number;
  isClosed: boolean;
};

async function submitLogin(password: string) {
  return await fetch(`${process.env.REACT_APP_URL}/loginAdmin`, {
    method: "post",
    headers: { "Content-Type": "text/plain" },
    body: password,
  });
}

const getAdminSchedule = async () => {
  try {
    const result = await fetch(`${process.env.REACT_APP_URL}/adminObject`);
    const string = await result.text();
    return JSON.parse(string) as ISchedule;
  } catch (e) {
    return {} as ISchedule;
  }
};

const formatPhoneNumber = (string: string) => {
  if (string.length === 10) {
    return `${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 10)}`;
  }
};

const sortAppointments = (appts: IAppointmentRecord[]) =>
  [...appts].sort((a, b) => {
    const [aMoment, bMoment] = [a.time, b.time].map((time) => {
      const [timePart, period] = time.split(" ");
      const [hours, minutes] = timePart.split(":").map(Number);
      let normalizedHours = hours % 12;
      if (period === "PM") {
        normalizedHours += 12;
      }
      return normalizedHours * 60 + minutes;
    });

    return aMoment - bMoment;
  });

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
          const response = await submitLogin(password);

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
              const response = await submitLogin(password);

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

  background-color: white;

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
        <button>Yes</button>

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
  margin-top: 2em;
  border: 1px solid grey;
  border-radius: 2px;
  background-color: ${(props) => (props.isCheckForm ? "default;" : "#5BF563;")};
`;

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
        <span>Barber: </span>
      </div>
      <div className={"column item"}>
        <div>{appointment.name}</div>
        <div>{formatPhoneNumber(appointment.phone)}</div>
        <div>{appointment.time}</div>
        <div>{appointment.barber}</div>
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
  dayKey,
  setShow,
  className,
}: {
  dayKey: IDay;
  setShow: (show: boolean) => void;
  className?: string;
}) => {
  const [appts, setAppts] = useState<IAppointmentRecord[] | [] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getAdminSchedule()
      .then((schedule) => {
        setAppts(sortAppointments(schedule[dayKey]?.appts ?? []));
      })
      .finally(() => setIsLoading(false));
  }, [dayKey]);

  const canBack = appts?.length && index > 0 ? true : false;
  const canForward = appts?.length && index < appts.length - 1 ? true : false;

  const hasToken = () => Boolean(appts && appts[index] && appts[index].token);

  if (isLoading) {
    return <span>loading</span>;
  }
  return (
    <div className={className}>
      <h2>{getDayLabel(dayKey)}&apos;s&nbsp;Appointments</h2>
      {appts && appts.length > 0 && (
        <>
          <StyledAppointment appointment={appts[index]} />
          <StyledSelector canBack={canBack} canForward={canForward} setIndex={setIndex} />
        </>
      )}
      {appts && appts.length === 0 && (
        <div className={"no-appointments"}>No appointments to show!</div>
      )}
      <div className={"button-column"}>
        <button
          disabled={!hasToken()}
          className={"close-button"}
          onClick={() => {
            if (hasToken()) {
              fetch(`${process.env.REACT_APP_URL}/deleteAppointment`, {
                method: "post",
                body: appts![index].token,
              }).finally(() => setShow(false));
            }
          }}
        >
          Delete
        </button>
        <button
          className={"close-button"}
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </button>
      </div>
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

  .button-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .close-button {
    width: 5.5em;
    height: 2.5em;
  }
`;

function AdminLoggedIn({
  setAdminLoggedIn,
  setAdminLoginView,
  className,
}: {
  setAdminLoggedIn: (u: boolean) => void;
  setAdminLoginView: (u: boolean) => void;
  className?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [selected] = useState("");
  const [scheduleDays, setScheduleDays] = useState<IDays>([]);
  const [dayConfig, setDayConfig] = useState<Record<IDay, IDayConfig>>({} as Record<IDay, IDayConfig>);
  const [appointmentViewDay, setAppointmentViewDay] = useState<IDay | null>(null);
  const [isCheckForm, setIsCheckForm] = useState(true);
  const [bulletin, setBulletin] = useState("");

  useEffect(() => {
    (async () => {
      const adminObject = await getAdminSchedule();
      const days = sortDays(Object.keys(adminObject) as IDays);

      setScheduleDays(days);

      const nextDayConfig = {} as Record<IDay, IDayConfig>;

      days.forEach((day) => {
        const hours = adminObject[day]?.hours;

        nextDayConfig[day] = {
          open: Array.isArray(hours) ? hours[0] : 8,
          closed: Array.isArray(hours) ? hours[1] : 18,
          isClosed: hours === null,
        };
      });

      setDayConfig(nextDayConfig);
    })();

    (async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_URL}/get-bulletin`);
        setBulletin(await result.text());
      } catch (e) {
        return;
      }
    })();
  }, []);

  const clampDayConfig = (config: IDayConfig): IDayConfig => {
    const open = Number.isFinite(config.open) ? Math.max(8, Math.min(18, config.open)) : 8;
    const closed = Number.isFinite(config.closed) ? Math.max(8, Math.min(18, config.closed)) : 18;

    return {
      ...config,
      open: Math.min(open, closed),
      closed: Math.max(closed, open),
    };
  };

  const updateDayConfig = (day: IDay, nextPartial: Partial<IDayConfig>) => {
    setIsCheckForm(true);
    setDayConfig((current) => ({
      ...current,
      [day]: {
        ...current[day],
        ...nextPartial,
      },
    }));
  };

  const handleBlur = (day: IDay) => {
    setDayConfig((current) => ({
      ...current,
      [day]: clampDayConfig(current[day]),
    }));
  };

  const handleSave = async () => {
    const requestBody = scheduleDays.reduce((acc, day) => {
      const config = clampDayConfig(dayConfig[day]);

      acc[day] = {
        hours: config.isClosed ? null : [config.open, config.closed],
      };

      return acc;
    }, {} as Record<IDay, { hours: number[] | null }>);

    setIsCheckForm(true);

    try {
      await fetch(`${process.env.REACT_APP_URL}/adminUpdateSchedule`, {
        method: "post",
        body: JSON.stringify(requestBody),
      });
    } catch (e) {
      return;
    }
  };

  const handleFocus = () => {
    setIsCheckForm(true);
  };

  return (
    <Container className={className}>
      <Fog show={showModal} />
      {showModal && (
        <StyledModal employee={selected} show={showModal} setShowModal={setShowModal} />
      )}
      {appointmentViewDay && (
        <StyledAppointmentView dayKey={appointmentViewDay} setShow={() => setAppointmentViewDay(null)} />
      )}
      <div className="group-container">
        <h2>Schedule</h2>
        <div className={"hours-container"}>
          <div className="heading-row">
            <span>Day</span>
            <span>Open</span>
            <span>Close</span>
            <span>Closed</span>
          </div>
          {scheduleDays.map((day) => {
            const config = dayConfig[day];

            if (!config) {
              return null;
            }

            return (
              <div key={day}>
                <span>{getDayLabel(day)}</span>
                <input
                  disabled={config.isClosed}
                  type={"number"}
                  value={config.open}
                  onChange={(e) => {
                    updateDayConfig(day, { open: parseInt(e.target.value, 10) });
                  }}
                  onBlur={() => handleBlur(day)}
                  onFocus={handleFocus}
                />
                <input
                  disabled={config.isClosed}
                  type={"number"}
                  value={config.closed}
                  onChange={(e) => {
                    updateDayConfig(day, { closed: parseInt(e.target.value, 10) });
                  }}
                  onBlur={() => handleBlur(day)}
                  onFocus={handleFocus}
                />
                <input
                  checked={config.isClosed}
                  type="checkbox"
                  onChange={(e) => {
                    updateDayConfig(day, { isClosed: Boolean(e.target.checked) });
                  }}
                  value={Boolean(config.isClosed) ? "on" : "off"}
                  onFocus={handleFocus}
                />
              </div>
            );
          })}
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
          {scheduleDays.map((day) => (
            <div key={day}>
              <span>{getDayLabel(day)}</span>
              <div>
                <button
                  onClick={() => {
                    setAppointmentViewDay(day);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="group-container bulletin-group">
        <h2>Bulletin</h2>
        <div className="bulletin-container">
          <textarea
            value={bulletin}
            placeholder="Enter bulletin text"
            onChange={(e) => {
              setBulletin(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              await fetch(`${process.env.REACT_APP_URL}/save-bulletin`, {
                method: "post",
                body: bulletin,
              });
            }}
          >
            Save Bulletin
          </button>
          <button
            onClick={async () => {
              await fetch(`${process.env.REACT_APP_URL}/delete-bulletin`);
              setBulletin("");
            }}
          >
            Delete Bulletin
          </button>
        </div>
      </div>
      <div className="group-container">
        <EmployeeRoster />
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
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;

  background-color: white;

  h2 {
    width: 10em;
  }

  .group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 2em 3em;
    min-height: 30em;
    width: 22em;
  }

  .bulletin-group {
    width: 24em;
  }

  .hours-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    gap: 0.6em;

    > div {
      display: grid;
      grid-template-columns: minmax(5.5em, 1fr) 4em 4em 4em;
      align-items: center;
      column-gap: 0.75em;
    }

    .heading-row {
      font-weight: bold;
    }

    input {
      width: 100%;
      box-sizing: border-box;
    }

    button {
      width: 6.5em;
      height: 2.5em;
      margin: 0;
    }
  }

  .bulletin-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.9em;

    textarea {
      min-height: 10em;
      resize: vertical;
      padding: 0.9em;
      font: inherit;
      box-sizing: border-box;
    }

    button {
      margin: 0;
      height: 2.8em;
    }
  }

  button {
    margin: 1em 1em 0em;
  }
`;
