import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { colors } from "./utilities";
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

const SelectedIcon = styled.div<{ show: boolean; size: number }>`
  //  display: ${(props) => (props.show ? "block" : "none")};

  border-radius: 32px;

  width: ${(props) => (props.show ? "1em" : "0em")};
  height: ${(props) => (props.show ? "1em" : "0em")};

  transition: width 0.1s ease-in, height 0.1s ease-in;

  background-color: ${colors.coolBlue};
`;

const TextContainer = styled.span``;

let duration = 0.1;

const TimeBox = styled.div<{ show: boolean }>`
  overflow-y: scroll;
  height: ${(props) => (props.show ? "80%" : "0")};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;

  padding: ${(props) => (props.show ? "1em 0em" : "0")};

  background-color: white;

  font-size: 1.5em;
  border: ${(props) => (props.show ? "1px solid black" : "0px solid black")};
  border-radius: 10px;

  opacity: ${(props) => (props.show ? 1 : 0)};

  transition: opacity ${duration}s ease-in-out;
  transition: height ${duration}s ease-in, padding ${duration}s ease-in, border ${duration}s ease-in;

  // z-index: ${(props) => (props.show ? 1000 : -1)};

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  ${RowContainer} {
    width: 14em;
    max-width: 12em;

    background-color: white;

    padding: 0.71em 1em;

    box-sizing: content-box;

    &:hover {
      background-color: ${colors.chairBlue};
      cursor: pointer;
    }

    ${IconContainer} {
    }

    ${TextContainer} {
      margin-left: 1em;
    }
  }
`;

const StyledLabel = styled.label``;

const delay = (ms: number, cb: () => void) => setTimeout(cb, ms);

const MySelector = ({
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
      {/* <TimeBox ref={timeBoxRef} show={show}>
        {times.map((_time) => {
          return (
            <RowContainer
              onClick={() => {
                setTime(_time);
                setStartAnimation(true);
              }}
            >
              <IconContainer>
                <SelectedIcon show={_time === time} size={count} />
              </IconContainer>
              <TextContainer>{_time}</TextContainer>
            </RowContainer>
          );
        })}
      </TimeBox> */}
      <StyledLabel>Time</StyledLabel>
      <select
      // onClick={() => {
      //   setShow((show) => !show);
      // }}
      >
        {times.map((time) => (
          <option>{time}</option>
        ))}
      </select>
    </div>
  );
};

const StyledTime = styled(MySelector)`
  margin-left: 1em;
  margin-bottom: 1em;
  // border: 1px solid black;
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  &:focus {
    border: 1px solid ${colors.coolBlue};
  }

  &:active {
    border: 1px solid ${colors.coolBlue};
  }

  select {
    overflow: scroll;

    width: 12em;
    padding: 1em;

    cursor: pointer;
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

    /* &:focus {
      border: 1px solid ${colors.coolBlue};
    }

    &:active {
      border: 1px solid ${colors.coolBlue};
    } */
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
  return (
    <div className={className}>
      <StyledLabel>Phone Number</StyledLabel>
      <input placeholder={"Phone #"} onChange={(e) => setPhone(e.target.value)}></input>
    </div>
  );
};

const StyledDays = styled(Days)`
  margin-left: 1em;
  margin-bottom: 1em;
  // border: 1px solid black;
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  &:focus {
    border: 1px solid ${colors.coolBlue};
  }

  &:active {
    border: 1px solid ${colors.coolBlue};
  }

  select {
    overflow: scroll;

    width: 12em;
    padding: 1em;

    cursor: pointer;
  }

  option {
    font-size: ${selectorFontSize};
    padding: 0.6em 1em;
  }
`;

const StyledName = styled(Name)`
  margin-left: 1em;
  margin-bottom: 1em;
  // border: 1px solid black;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  input {
    font-size: ${inputFontSize}em;

    // margin-top: 0.2em;
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
  // border: 1px solid black;
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  input {
    font-size: ${inputFontSize}em;

    // margin-top: 0.2em;
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

const Confirm = styled(Anchor)`
  align-self: center;
  padding: 0.7em;

  min-width: 50%;

  &:hover {
    cursor: pointer;
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
  console.log(isLoading, "isLoading");
  return (
    <Column>
      <FormWrapper>
        {isLoading && <>{isLoading}</>}
        {!isLoading && (
          <>
            {/* <StartColumn marginTop={0.5}>
              {["Name", "Phone #", "Day", "Time"].map((item) => (
                <div>{item}</div>
              ))}
            </StartColumn> */}
            <StartColumn>
              <StyledName setName={setName} />
              <StyledPhoneNumber setPhone={setPhone} />
              {days && (
                <StyledDays setDay={setDay} days={Object.keys(times!) as unknown as IDays[]} />
              )}
              {times && time && <StyledTime time={time} setTime={setTime} times={times[day]} />}

              <Confirm
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
          </>
        )}
      </FormWrapper>
    </Column>
  );
}
