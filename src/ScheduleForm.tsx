import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { colors, isNumeric } from "./utilities";
const Anchor = styled.a`
  //  padding: 1.5em 2.4em;

  background-color: ${colors.coolBlue};

  font-size: 1em;

  color: white;

  border: none;

  margin: 1em;

  text-decoration: none;

  border-radius: 2px;

  display: grid;
  place-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${colors.chairBlue};
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const selectorFontSize = "1em";
const inputFontSize = 1.05;
const marginBottom = "1.25em";
const elementHeight = "5em";

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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const IconContainer = styled.div`
  border-radius: 32px;

  width: 1.2em;
  height: 1.2em;

  border: 1px solid ${colors.milGreen};

  display: grid;
  place-items: center;
`;

const StyledLabel = styled.label`
  margin-bottom: 0.2em;
`;

const delay = (ms: number, cb: () => void) => setTimeout(cb, ms);

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
  const [show, setShow] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const timeBoxRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const handleClickOutside = (event: MouseEvent) => {
    if (timeBoxRef.current && !timeBoxRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!startAnimation) return;

    const handler = delay(120, () => {
      setShow(false);
      setStartAnimation(false);
    });

    return () => clearInterval(handler);
  }, [startAnimation]);

  return (
    <div className={className}>
      <StyledLabel>Time</StyledLabel>
      <div className={"select-border-wrapper"}>
        <select>
          {times.map((time) => (
            <option>{time}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const StyledTimes = styled(Times)`
  margin-left: 1em;
  margin-bottom: 1em;

  display: flex;
  flex-direction: column;

  .select-border-wrapper {
    display: grid;
    place-items: center;
    height: 3em;
    width: 12em;
  }

  select {
    overflow: scroll;
    box-sizing: content-box;
    width: 12em;
    padding: 1em;

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

const Days = ({
  days,
  setDay,
  className,
}: {
  days: IDays[];
  setDay: (day: IDays) => void;
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
        >
          {days.map((day) => (
            <option value={day}>{day}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const Name = ({ setName, className }: { setName: (name: string) => void; className?: string }) => {
  return (
    <div className={className}>
      <StyledLabel>Name</StyledLabel>
      <input placeholder={"e.g. John Smith"} onChange={(e) => setName(e.target.value)} />
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
  console.log(areaCode, prefix, suffix, "phone #");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    ref?: React.MutableRefObject<HTMLInputElement | null>
  ) => {
    if (isNumeric(e.target.value)) {
      if (e.target.value.length > 4) {
        return;
      }
      setter(e.target.value);
      if (ref?.current) {
        if (e.target.value.length === 3) {
          return ref.current?.focus(); // Shift focus when area code is 3 digits
        }
      }
    }
  };

  useEffect(() => {
    setPhone(areaCode + prefix + suffix);
  }, [areaCode, prefix, suffix]);

  return (
    <div className={className}>
      <StyledLabel>Phone Number</StyledLabel>
      <div className={"phone-row"}>
        <input
          value={areaCode}
          ref={areaCodeRef}
          className={"phone-area-code"}
          placeholder={"(555)"}
          onChange={(e) => handleChange(e, setAreaCode, prefixRef)}
        ></input>
        <span className={"markup"}>-</span>
        <input
          value={prefix}
          ref={prefixRef}
          className={"phone-prefix"}
          placeholder={"555"}
          onChange={(e) => handleChange(e, setPrefix, suffixRef)}
        ></input>
        <span className={"markup"}>-</span>
        <input
          value={suffix}
          ref={suffixRef}
          className={"phone-suffix"}
          placeholder={"5555"}
          onChange={(e) => handleChange(e, setSuffix)}
        ></input>
      </div>
    </div>
  );
};

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
`;

const StyledDays = styled(Days)`
  margin-left: 1em;
  margin-bottom: 1em;

  display: flex;
  flex-direction: column;

  .select-border-wrapper {
    height: 3em;
    width: 12em;
    display: grid;
    place-items: center;
  }

  select {
    overflow: scroll;
    box-sizing: content-box;

    width: 12em;
    padding: 1em;

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

const StartColumn = styled.div<{ marginTop?: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  height: 40vh;

  justify-content: space-between;
`;

const Confirm = styled.button`
  padding: 1em 2em;

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

type IDays = "Today" | "Tomorrow";

type ITimesObject = {
  [key in IDays]: string[];
};

export function ScheduleForm({
  showForm,
  setShowForm,
}: {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}) {
  const [barber, setBarber] = useState("Mitch");
  const [day, setDay] = useState<IDays>("Today");
  const [days, setDays] = useState<IDays[] | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [times, setTimes] = useState<ITimesObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isNotReady = () => !Boolean(phone.length === 10 && name);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_URL}/times`);
        const timesObject = (await result.json()) as ITimesObject;
        const dayss = Object.keys(timesObject);

        setDays(dayss as IDays[]);
        setTimes(timesObject);
      } catch (e) {
        setHasError(true);
      } finally {
        console.log(isLoading, "isloading in useeffect");
        setIsLoading(false);
      }
    })();
  }, [showForm]);

  useEffect(() => {
    if (!times) return;

    setTime(times[day][0]);
  }, [times, day]);
  // console.log(phone, phone.length, name, name.length, isNotReady(), "phone");
  return (
    <Column>
      <FormWrapper>
        {isLoading && <>{isLoading}</>}
        {!isLoading && (
          <StartColumn>
            <StyledName setName={setName} />
            <StyledPhoneNumber setPhone={setPhone} />
            {days && (
              <StyledDays setDay={setDay} days={Object.keys(times!) as unknown as IDays[]} />
            )}
            {times && time && <StyledTimes time={time} setTime={setTime} times={times[day]} />}

            <Confirm
              disabled={isNotReady()}
              onClick={async () => {
                await fetch(`${process.env.REACT_APP_URL}/newAppointment`, {
                  method: "post",
                  body: JSON.stringify({ day, time, barber, name, phone }),
                }).finally(() => setShowForm(false));
              }}
            >
              Confirm
            </Confirm>
            <StyledCancel onClick={() => setShowForm(false)}>Cancel</StyledCancel>
          </StartColumn>
        )}
      </FormWrapper>
    </Column>
  );
}
