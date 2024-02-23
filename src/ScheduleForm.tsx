//#region imports

import moment from "moment-timezone";
import { useState, useEffect, useRef } from "react";
import styled, { IStyledComponent } from "styled-components";

import { colors } from "./utilities";

//#endregion imports

//#region env vars

const tz = process.env.TZ || "America/Chicago";
const localStorageScheduledTime = "scheduledTime";

//#endregion env vars

//#region layout

const selectorFontSize = "1em";
const inputFontSize = 1.05;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: center;
`;

const StyledLabel = styled.label`
  margin-bottom: 0.2em;
`;

const StartColumn = styled.div<{ marginTop?: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  justify-content: space-between;
`;

//#endregion layout

//#region form components

const BaseName = ({
  name,
  setName,
  className,
}: {
  name: string;
  setName: (name: string) => void;
  className?: string;
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const isAlphabetic = /^[A-Za-z\s'.\-,]+$/.test(e.target.value);
    if (isAlphabetic || e.target.value === "") {
      setter(e.target.value);
    }
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <div className={className}>
      <StyledLabel>Name</StyledLabel>
      <input
        ref={nameRef}
        placeholder={"e.g. John Smith"}
        onChange={(e) => handleChange(e, setName)}
        value={name}
        type={"text"}
      />
    </div>
  );
};

const Name = styled(BaseName)`
  margin-left: 1em;
  margin-bottom: 1em;

  display: flex;
  flex-direction: column;
  input {
    font-size: ${inputFontSize}em;

    width: 14em;
    padding: 0.8em;
  }

  input::placeholder {
    font-size: ${inputFontSize * 0.8}em;
  }
`;

const BasePhoneNumber = ({
  setPhone,
  className,
}: {
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) => {
  const [areaCode, setAreaCode] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  const areaCodeRef = useRef<HTMLInputElement | null>(null);
  const prefixRef = useRef<HTMLInputElement | null>(null);
  const suffixRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    ref?: React.MutableRefObject<HTMLInputElement | null>
  ) => {
    if (e.target.value.length > 4) {
      return;
    }
    setter(e.target.value);
    if (ref?.current) {
      if (e.target.value.length === 3) {
        return ref.current?.focus(); // Shift focus when area code is 3 digits
      }
    }
  };

  useEffect(() => {
    setPhone(areaCode + prefix + suffix);
  }, [areaCode, prefix, suffix, setPhone]);

  return (
    <div className={className}>
      <StyledLabel>Phone Number</StyledLabel>
      <div className={"phone-row"}>
        <input
          value={areaCode}
          type={"number"}
          ref={areaCodeRef}
          className={"phone-area-code"}
          placeholder={"(555)"}
          onChange={(e) => handleChange(e, setAreaCode, prefixRef)}
        ></input>
        <span className={"markup"}>-</span>
        <input
          value={prefix}
          type={"number"}
          ref={prefixRef}
          className={"phone-prefix"}
          placeholder={"555"}
          onChange={(e) => handleChange(e, setPrefix, suffixRef)}
        ></input>
        <span className={"markup"}>-</span>
        <input
          value={suffix}
          type={"number"}
          ref={suffixRef}
          className={"phone-suffix"}
          placeholder={"5555"}
          onChange={(e) => handleChange(e, setSuffix)}
        ></input>
      </div>
    </div>
  );
};

const PhoneNumber = styled(BasePhoneNumber)`
  margin-left: 1em;
  margin-bottom: 1em;

  display: flex;
  flex-direction: column;

  .phone-row {
    display: flex;
    flex-direction: row;
    width: 20em;
    align-items: center;
  }

  .phone-area-code {
    font-size: ${inputFontSize}em;

    width: 2em;
    padding: 0.8em;
  }

  .phone-prefix {
    font-size: ${inputFontSize}em;

    width: 2em;
    padding: 0.8em;
  }

  .phone-suffix {
    font-size: ${inputFontSize}em;

    width: 4em;
    padding: 0.8em;
  }

  .markup {
    font-size: ${inputFontSize}em;
    font-weight: bold;
    width: 1.15em;
    display: grid;
    place-items: center;
    margin: 0;
    padding: 0;
  }

  input::placeholder {
    font-size: ${inputFontSize * 0.8}em;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
`;

const BaseBarbers = ({
  barber,
  barbers,
  setBarber,
  className,
}: {
  barber: string | null;
  barbers: string[] | null;
  setBarber: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
}) => {
  return (
    <div className={className}>
      {barber && barbers && barbers.length && (
        <>
          <StyledLabel>Barber</StyledLabel>
          <div className={"select-border-wrapper"}>
            <select
              onChange={(e) => {
                setBarber(e.target.value);
              }}
              value={barber}
            >
              {barbers.map((barbers) => (
                <option>{barbers}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

const Barbers = styled(BaseBarbers)`
  margin-left: 1em;
  height: 5.5em;
  display: flex;
  flex-direction: column;

  .select-border-wrapper {
    display: grid;
    place-items: center;
    height: 3.4em;
    width: 12.4em;
  }

  select {
    overflow: scroll;
    box-sizing: content-box;
    width: 12em;
    padding: 1.2em;
    background-color: white;
    border-radius: 2px;
    cursor: pointer;

    &:focus {
      border: 2px solid black;
    }

    &:active {
      border: 2px solid black;
    }
  }

  option {
    overflow: scroll;
    width: 12em;
    padding: 5em;
    margin: 5em;
  }
`;

const BaseDays = ({
  day,
  days,
  setDay,
  className,
}: {
  day: IDay | null;
  days: IDays;
  setDay: (days: IDay) => void;
  className?: string;
}) => {
  if (!day || !days) {
    return <></>;
  }
  return (
    <div className={className}>
      <StyledLabel>Day</StyledLabel>
      <div className={"select-border-wrapper"}>
        <select
          onChange={(e) => {
            setDay(e.target.value as IDay);
          }}
          value={day}
        >
          {days.map((day) => (
            <option value={day}>{day === "day0" ? "Today" : "Tomorrow"}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const Days = styled(BaseDays)`
  margin-left: 1em;
  //margin-bottom: 1em;

  display: flex;
  flex-direction: column;
  height: 5.5em;

  .select-border-wrapper {
    height: 3.4em;
    width: 12.4em;
    display: grid;
    place-items: center;
  }

  select {
    overflow: scroll;
    box-sizing: content-box;

    width: 12em;
    padding: 1.2em;

    background-color: white;

    border-radius: 2px;

    cursor: pointer;

    &:focus {
      border: 2px solid black;
    }

    &:active {
      border: 2px solid black;
    }
  }

  option {
    font-size: ${selectorFontSize};
    padding: 0.6em 1em;
  }
`;

const BaseTimes = ({
  time,
  times,
  setTime,
  day,
  barber,
  NoAvailabilityComponent,
  className,
}: {
  time: string | null;
  times: string[] | null;
  setTime: (time: string) => void;
  day: IDay;
  barber: string | null;
  NoAvailabilityComponent: IStyledComponent<
    "web",
    FastOmit<
      {
        day: IDay | null;
        barber: string | null;
        className?: string | undefined;
      },
      never
    >
  >;
  className?: string;
}) => {
  return (
    <div className={className}>
      {time && times && times.length && (
        <>
          <StyledLabel>Time</StyledLabel>
          <div className={"select-border-wrapper"}>
            <select
              onChange={(e) => {
                setTime(e.target.value);
              }}
              value={time}
            >
              {times.map((time) => (
                <option>{time}</option>
              ))}
            </select>
          </div>
        </>
      )}
      {!time && barber && <NoAvailabilityComponent barber={barber} day={day} />}
    </div>
  );
};

const Times = styled(BaseTimes)`
  margin-left: 1em;
  height: 5.5em;
  display: flex;
  flex-direction: column;

  .select-border-wrapper {
    display: grid;
    place-items: center;
    height: 3.4em;
    width: 12.4em;
  }

  select {
    overflow: scroll;
    box-sizing: content-box;
    width: 12em;
    padding: 1.2em;

    background-color: white;

    border-radius: 2px;

    cursor: pointer;

    &:focus {
      border: 2px solid black;
    }

    &:active {
      border: 2px solid black;
    }
  }

  option {
    overflow: scroll;
    width: 12em;

    padding: 5em;

    margin: 5em;
  }
`;

//#endregion form components

//#region other pieces

const Loading = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
`;

const StyledConfirm = styled.button`
  padding: 1.3em 2em;
  background-color: ${colors.coolBlue};
  font-size: 1em;
  color: white;
  border: none;
  margin-top: 1.5em;
  margin-bottom: 1em;
  text-decoration: none;
  border-radius: 2px;
  display: grid;
  place-items: center;
  align-self: center;

  &:hover {
    cursor: pointer;
    background-color: ${colors.chairBlue};
  }

  &:disabled {
    cursor: default;
    background-color: ${colors.chairBlue};
  }

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (min-width: 768px) {
    width: 90%;
  }
`;

const StyledCancel = styled.div`
  align-self: center;
  padding: 0.7em;
  &:hover {
    cursor: pointer;
  }
`;

const BaseNoAvailability = ({
  day,
  barber,
  className,
}: {
  day: IDay | null;
  barber: string | null;
  className?: string;
}) => (
  <span className={className}>
    {barber ? `${barber} Has ` : ""}No Availability {day === "day0" ? "Today" : "Tomorrow"}
  </span>
);

const NoAvailability = styled(BaseNoAvailability)`
  height: 3.5em;
  padding-top: 1.5em;
  width: 100%;
  color: ${colors.coolBlue};
  font-weight: bold;
`;

const AlreadyScheduledView = ({
  handleSubmit,
  handleGoBack,
  className,
}: {
  handleSubmit: () => void;
  handleGoBack: () => void;
  className?: string;
}) => {
  const token = localStorage.getItem("token");
  return (
    <div className={className}>
      <h2>You already have a scheduled appt at: </h2>
      <h2>
        {getAlreadyScheduled()} {localStorage.getItem("scheduledDay")}
      </h2>
      <div className={"do-you-want"}>Do you want to cancel?</div>
      <StyledConfirm
        onClick={() => {
          fetch(`${process.env.REACT_APP_URL}/deleteAppointment`, {
            method: "post",
            body: token,
          }).finally(() => handleSubmit());
        }}
      >
        Cancel This Appointment
      </StyledConfirm>
      <StyledConfirm className={"tertiary"} onClick={() => handleGoBack()}>
        <span>Keep This Appointment</span>
        <span>and book another one</span>
      </StyledConfirm>
    </div>
  );
};

const StyledAlreadyScheduledView = styled(AlreadyScheduledView)`
  padding: 0em 2em;
  display: flex;
  flex-direction: column;

  ${StyledConfirm} {
    height: 6em;
  }

  .do-you-want {
    font-size: 1.2em;
    padding: 0.5em;
    margin: 0.3em;
    align-self: center;
  }

  a {
    align-self: center;
    margin-top: 1em;
    font-size: 1.2em;
    color: rgba(100, 100, 100, 1);
  }

  a:hover {
    cursor: pointer;
  }

  .tertiary {
    background-color: rgb(122, 122, 122);
  }

  .tertiary:hover {
    background-color: rgb(166, 166, 166);
  }
`;

const SuccessfulAppointmentView = ({
  onDone,
  className,
}: {
  onDone: () => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <div>
        <h2>You are all set to go! 🎉</h2>
        <div className={"do-you-want"}>See you at</div>
        <h2 className={"time-row"}>
          <span className={"time-icon"}>⭐</span>

          <div className={"time"}>
            <div className={"time-text"}>{getAlreadyScheduled()}</div>
            <span className={"time-day"}>{localStorage.getItem("scheduledDay")}</span>
          </div>
        </h2>
      </div>

      <StyledConfirm className={"tertiary"} onClick={() => onDone()}>
        Close
      </StyledConfirm>
    </div>
  );
};

const StyledSuccessfulAppointmentView = styled(SuccessfulAppointmentView)`
  display: flex;

  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 0em 1.9em 1em 1.9em;
  .do-you-want {
    font-size: 1.2em;
    padding: 0.5em;
    margin: 0.3em;
    align-self: flex-start;
  }

  .time-row {
    display: flex;
    flex-direction: row;
  }

  .time-icon {
    font-size: 1.7em;
    padding-top: 0.3em;
  }

  .time {
    color: ${colors.coolBlue};
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.3em;
  }

  .time-day {
    font-size: 1.1em;
  }

  .time-text {
    font-size: 1.7em;
  }

  a {
    align-self: center;
    margin-top: 1em;
    font-size: 1.2em;
    color: rgba(100, 100, 100, 1);
  }

  a:hover {
    cursor: pointer;
  }

  .tertiary {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(122, 122, 122);
  }

  .tertiary:hover {
    background-color: rgb(166, 166, 166);
  }
`;

const BaseConflictView = ({
  day,
  time,
  onDone,
  className,
}: {
  day: IDay | null;
  time: string | null;
  onDone: (e?: any) => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h2>Uh oh</h2>
      <div className={"do-you-want"}>Looks like someone JUST scheduled that time!!</div>
      <h2 className={"time"}>
        {time} {day}
      </h2>
      <div className={"button-layout"}>
        <StyledConfirm className={"tertiary"} onClick={() => onDone()}>
          Find Another Time
        </StyledConfirm>
      </div>
    </div>
  );
};

const ConflictView = styled(BaseConflictView)`
  display: flex;
  flex-direction: column;
  padding: 0em 4em;
  .do-you-want {
    font-size: 1.2em;
    padding: 0.5em;
    margin: 0.3em;
    align-self: flex-start;
  }

  .time {
    color: ${colors.hotRed};
    align-self: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    text-decoration: line-through;

    padding-top: 2em;
  }

  a {
    align-self: center;
    margin-top: 1em;
    font-size: 1.2em;
    color: rgba(100, 100, 100, 1);
  }

  a:hover {
    cursor: pointer;
  }

  .button-layout {
    padding-top: 5.5em;
  }

  .tertiary {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.coolBlue};
  }

  .tertiary:hover {
    background-color: ${colors.chairBlue};
  }
`;

//#endregion other pieces

//#region utilities

const getAlreadyScheduled = () => {
  const itemString = localStorage.getItem(localStorageScheduledTime);
  if (itemString) {
    const item = JSON.parse(itemString);
    if (item) {
      const scheduledTime = parseInt(item);
      if (typeof scheduledTime === "number") {
        const currentTime = moment(scheduledTime).tz(tz).format("h:mm A");
        return currentTime;
      }
    }
  }
  return null;
};

const checkIfAlreadyScheduled = async (): Promise<boolean> =>
  new Promise((resolve) => {
    const itemString = localStorage.getItem(localStorageScheduledTime);
    if (itemString) {
      const item = JSON.parse(itemString);
      if (item) {
        const scheduledTime = parseInt(item);
        if (typeof scheduledTime === "number") {
          const currentTime = moment.tz(tz);
          if (currentTime.valueOf() < scheduledTime) {
            const currentDay = currentTime.day();
            const scheduledDay = moment.tz(scheduledTime, tz).day();
            if (currentDay === scheduledDay) {
              localStorage.setItem("scheduledDay", "Today");
            } else {
              localStorage.setItem("scheduledDay", "Tomorrow");
            }
            resolve(true);
          }
        }
      }
    }
    resolve(false);
  });

const setLocalStorage = (day: IDay | null, time: string | null, token: string | null) => {
  let time1 = moment(time, "h:mm A");
  if (day === "day1") {
    time1.add(1, "day");
    localStorage.setItem("scheduledDay", "Tomorrow");
  } else {
    localStorage.setItem("scheduledDay", "Today");
  }

  localStorage.setItem(localStorageScheduledTime, time1.valueOf().toString());

  if (token) {
    localStorage.setItem("token", token);
  }
};

//#endregion utilities

//#region form

export function ScheduleForm({ setShowForm }: { setShowForm: (show: boolean) => void }) {
  const [barber, setBarber] = useState<string | null>(null);
  const [barbers, setBarbers] = useState<string[] | null>(null);
  const [day, setDay] = useState<IDay>("day1");
  const days: IDays = ["day0", "day1"];
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [times, setTimes] = useState<string[] | null>(null);
  const [token, setToken] = useState<string>("");
  const [clientObject, setClientObject] = useState<IClientObject | null>(null);
  const [mode, setMode] = useState<IMode>("loading");

  const isNotReady = () => !Boolean(phone.length === 10 && name && time);

  useEffect(() => {
    if (mode !== "loading") return;

    (async () => {
      try {
        // if first time running, fetch from service rather than use local
        const result = await fetch(`${process.env.REACT_APP_URL}/clientObject`);
        const clientObject = (await result.json()) as IClientObject;
        setClientObject(clientObject);

        const barberObject = clientObject?.barbers;
        const barbers = barberObject && Object.keys(barberObject);

        if (barbers && barbers.length) {
          const barber = barbers[0];
          const times = barberObject[barber][day];

          setBarbers(barbers);
          setBarber(barber);
          setTimes(times);
          if (times && times.length) {
            setTime(times[0]);
          }
        }

        setToken(clientObject?.token);

        checkIfAlreadyScheduled().then((isAlreadyScheduled) => {
          if (isAlreadyScheduled) {
            setMode("already");
          } else {
            setMode("form");
          }
        });
      } catch (e) {}
    })();
  }, [mode, day]);

  useEffect(() => {
    if (clientObject && barber) {
      const times = clientObject.barbers[barber][day];

      setTimes(times?.length ? times : null);
      if (times) {
        setTime(times[0]);
      } else {
        setTime(null);
      }
    }
  }, [barber, day, clientObject]);

  return (
    <Column>
      {mode === "success" && (
        <StyledSuccessfulAppointmentView
          onDone={() => {
            setShowForm(false);
            setMode("loading");
          }}
        />
      )}
      {mode === "conflict" && (
        <ConflictView
          day={day}
          time={time}
          onDone={() => {
            setMode("loading");
          }}
        />
      )}
      {mode === "already" && (
        <StyledAlreadyScheduledView
          handleSubmit={() => {
            localStorage.clear();
            setMode("loading");
          }}
          handleGoBack={() => {
            setMode("form");
          }}
        />
      )}
      {mode === "loading" && <Loading>Loading...</Loading>}
      {mode === "form" && (
        <FormWrapper>
          <StartColumn>
            <Name name={name} setName={setName} />
            <PhoneNumber setPhone={setPhone} />
            <Barbers barber={barber} barbers={barbers} setBarber={setBarber} />
            <Days setDay={setDay} days={days} day={day} />
            <Times
              time={time}
              setTime={setTime}
              times={times}
              day={day}
              barber={barber}
              NoAvailabilityComponent={NoAvailability}
            />
            <StyledConfirm
              disabled={isNotReady()}
              onClick={async () => {
                await fetch(`${process.env.REACT_APP_URL}/newAppointment`, {
                  method: "post",
                  body: JSON.stringify({ day, time, barber, name, phone, token }),
                })
                  .then((e) => {
                    const status = e.status;
                    if (status === 409) {
                      setMode("conflict");
                    } else if (e.ok) {
                      setLocalStorage(day, time, token);
                      setMode("success");
                    } else {
                      throw new Error("unhandled network exception");
                    }
                  })
                  .catch((e) => {
                    return;
                  });
              }}
            >
              Confirm
            </StyledConfirm>
            <StyledCancel
              onClick={() => {
                setMode("loading");
                setShowForm(false);
              }}
            >
              Cancel
            </StyledCancel>
          </StartColumn>
        </FormWrapper>
      )}
    </Column>
  );
}

//#endregion form
