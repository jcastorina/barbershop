import moment from "moment-timezone";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { colors } from "./utilities";

const tz = process.env.TZ || "America/Chicago";
const localStorageScheduledTime = "scheduledTime";

const selectorFontSize = "1em";
const inputFontSize = 1.05;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  // padding-top: 1em;

  justify-content: center;
`;

const StyledLabel = styled.label`
  margin-bottom: 0.2em;
`;

const StartColumn = styled.div<{ marginTop?: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  height: 40vh;

  justify-content: space-between;
`;

const Name = ({
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

const PhoneNumber = ({
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

const Days = ({
  day,
  days,
  setDay,
  className,
}: {
  day: IDays;
  days: IDays[];
  setDay: (days: IDays) => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <StyledLabel>Day</StyledLabel>
      <div className={"select-border-wrapper"}>
        <select
          onChange={(e) => {
            setDay(e.target.value as IDays);
          }}
          value={day}
        >
          {days.map((day) => (
            <option value={day}>{day}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const Times = ({
  time,
  times,
  setTime,
  className,
}: {
  time: string;
  times: string[];
  setTime: (time: string) => void;
  className?: string;
}) => {
  return (
    <div className={className}>
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
    </div>
  );
};

const StyledName = styled(Name)`
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

const StyledPhoneNumber = styled(PhoneNumber)`
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

const StyledDays = styled(Days)`
  margin-left: 1em;
  margin-bottom: 1em;

  display: flex;
  flex-direction: column;

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

const StyledTimes = styled(Times)`
  margin-left: 1em;
  margin-bottom: 1em;

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

  button {
    background-color: white;
    border: none;
    font-size: ${selectorFontSize};
    height: 3.5em;
    width: 14em;
    max-width: 90vh;
    padding: 0.6em 1em;
    margin: 0.2em;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding-left: 1.5em;
  }
`;

const StyledConfirm = styled.button`
  padding: 1.3em 2em;

  background-color: ${colors.coolBlue};

  font-size: 1em;

  color: white;

  border: none;

  margin: 1em;

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

const NotTakingAppointments = ({ day, className }: { day: IDays; className?: string }) => (
  <span className={className}>No Availability {day}</span>
);

const StyledNotTakingAppointments = styled(NotTakingAppointments)`
  margin-left: 1em;
  color: ${colors.coolBlue};
  font-weight: bold;
`;

type ITimesObject = {
  Today: string[] | null;
  Tomorrow: string[] | null;
  token: string;
};

type IDays = "Today" | "Tomorrow";

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

const checkIfAlreadyScheduled = (): boolean => {
  const itemString = localStorage.getItem(localStorageScheduledTime);
  if (itemString) {
    const item = JSON.parse(itemString);
    if (item) {
      const scheduledTime = parseInt(item);
      if (typeof scheduledTime === "number") {
        const currentTime = moment.tz(tz).valueOf();
        console.log(currentTime, scheduledTime, currentTime - scheduledTime, "times");
        if (currentTime < scheduledTime) {
          return true;
        }
      }
    }
  }

  return false;
};

const setLocalStorage = (day: IDays | null, time: string | null, token: string | null) => {
  let time1 = moment(time, "h:mm A");
  if (day === "Tomorrow") {
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

const Dialog = ({
  children,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
}) => <div className={className}>{children}</div>;

const StyledDialog = styled(Dialog)`
  position: absolute;
  height: 33em;
  width: 20.8em;
  background-color: rgba(255, 255, 255, 1);

  display: flex;
  flex-direction: column;
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
        Keep This Appointment
      </StyledConfirm>
    </div>
  );
};

const StyledAlreadyScheduledView = styled(AlreadyScheduledView)`
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
      <h2>You are all set to go!</h2>
      <div className={"do-you-want"}>See you at</div>
      <h2 className={"time"}>
        {getAlreadyScheduled()} {localStorage.getItem("scheduledDay")}
      </h2>
      <div className={"button-layout"}>
        <StyledConfirm className={"tertiary"} onClick={() => onDone()}>
          Close
        </StyledConfirm>
      </div>
    </div>
  );
};

const StyledSuccessfulAppointmentView = styled(SuccessfulAppointmentView)`
  .do-you-want {
    font-size: 1.2em;
    padding: 0.5em;
    margin: 0.3em;
    align-self: center;
  }

  .time {
    color: ${colors.coolBlue};
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
    padding-top: 6em;
  }

  .tertiary {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(166, 166, 166);
  }
`;

export function ScheduleForm({ setShowForm }: { setShowForm: (show: boolean) => void }) {
  const [barber] = useState("Mitch");
  const [day, setDay] = useState<IDays | null>(null);
  const [days, setDays] = useState<IDays[] | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [times, setTimes] = useState<ITimesObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isAlreadyScheduled, setIsAlreadyScheduled] = useState(false);
  const [isSuccessfullAppointment, setIsSuccessfulAppointment] = useState(false);

  const isNotReady = () => !Boolean(phone.length === 10 && name && time);

  useEffect(() => {
    if (!isLoading) return;
    (async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_URL}/clientObject`);
        const timesObject = (await result.json()) as ITimesObject;
        const days = Object.keys(timesObject);
        const todayIdx = days.indexOf("Today");
        const tomorrowIdx = days.indexOf("Tomorrow");
        if (timesObject.Today !== null) {
          if (timesObject.Today.length === 0) {
            setDay(days[tomorrowIdx] as IDays);
          } else {
            setDay(days[todayIdx] as IDays);
          }
        } else {
          if (timesObject.Tomorrow !== null) {
            setDay(days[tomorrowIdx] as IDays);
          } else {
            setDay(days[todayIdx] as IDays);
          }
        }

        setDays([days[todayIdx], days[tomorrowIdx]] as IDays[]);
        setTimes(timesObject);
        if (timesObject.token) {
          setToken(timesObject.token);
        } else {
          setToken("");
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isLoading]);

  useEffect(() => {
    if (!times || !day || !days) return;
    if (times && times[day]) {
      setTime(times[day]![0]);
    } else {
      setTime(null);
    }
  }, [times, day, days]);

  useEffect(() => {
    setIsAlreadyScheduled(checkIfAlreadyScheduled());
  }, []);
  console.log(isSuccessfullAppointment, "is succ");
  return (
    <Column>
      {isSuccessfullAppointment && (
        <StyledDialog>
          <StyledSuccessfulAppointmentView
            onDone={() => {
              setShowForm(false);
            }}
          />
        </StyledDialog>
      )}
      {isAlreadyScheduled && (
        <StyledDialog>
          <StyledAlreadyScheduledView
            handleSubmit={() => {
              localStorage.clear();
              setIsAlreadyScheduled(false);
              setShowForm(true);
              setIsLoading(true);
            }}
            handleGoBack={() => {
              setShowForm(false);
            }}
          />
        </StyledDialog>
      )}
      <FormWrapper>
        {isLoading && <>{isLoading}</>}
        {!isLoading && (
          <StartColumn>
            <StyledName name={name} setName={setName} />
            <StyledPhoneNumber setPhone={setPhone} />
            {days && day && <StyledDays setDay={setDay} days={days} day={day} />}
            {(times && time && day && times[day] && (
              <StyledTimes time={time} setTime={setTime} times={times[day]!} />
            )) ||
              (day && <StyledNotTakingAppointments day={day} />)}
            <StyledConfirm
              disabled={isNotReady()}
              onClick={async () => {
                await fetch(`${process.env.REACT_APP_URL}/newAppointment`, {
                  method: "post",
                  body: JSON.stringify({ day, time, barber, name, phone, token }),
                }).finally(() => {
                  setLocalStorage(day, time, token);
                  setIsSuccessfulAppointment(true);
                });
              }}
            >
              Confirm
            </StyledConfirm>
            <StyledCancel onClick={() => setShowForm(false)}>Cancel</StyledCancel>
          </StartColumn>
        )}
      </FormWrapper>
    </Column>
  );
}
