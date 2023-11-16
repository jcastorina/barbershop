import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { colors } from "./utilities";
import { start } from "repl";

const selectorFontSize = "1em";
const inputFontSize = "1.05em";
const marginBottom = "1.25em";
const elementHeight = "5em";

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: row;
  padding-top: 1em;
`;

const StyledDiv = styled.div`
  margin-left: 1em;
  height: ${elementHeight};
  font-weight: bold;

  display: flex;
  flex-direction: column;
  justify-content: center;

  input {
    height: 2em;
  }

  select {
    font-size: ${selectorFontSize};
    height: 4em;
    width: 14em;

    padding: 0.6em 1em;
    margin: 0.2em;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    option {
      color: pink;
    }
  }
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
  display: ${(props) => (props.show ? "block" : "none")};

  border-radius: 32px;

  width: ${(props) => (props.show ? "1em" : "0.5em")};
  height: ${(props) => (props.show ? "1em" : "0.5em")};

  transition: width 1s ease-in, height 1s ease-in;

  background-color: ${colors.coolBlue};
`;

const TextContainer = styled.span``;

const TimeBox = styled.div<{ show: boolean }>`
  overflow-y: scroll;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;

  padding: 1em 0em;

  background-color: white;

  font-size: 1.5em;
  border: 1px solid black;
  border-radius: 5px;

  opacity: ${(props) => (props.show ? 1 : 0)};

  transition: opacity 0.1s ease-in;

  z-index: ${(props) => (props.show ? 1000 : -1)};

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

const delay = (ms: number, cb: () => void) => setInterval(cb, ms);

let _count = 0;

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

    const handler = delay(16, () => {
      _count++;
      setCount(_count);
    });

    if (_count >= 15) {
      clearInterval(handler);
      _count = 0;
      setCount(0);
      setStartAnimation(false);
    }

    return () => clearInterval(handler);
  }, [startAnimation, count]);

  console.log(count);
  return (
    <div className={className}>
      <TimeBox ref={timeBoxRef} show={show}>
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
      </TimeBox>
      <button
        onClick={() => {
          setShow((show) => !show);
        }}
      >
        {time}
      </button>
    </div>
  );
};

const StyledTime = styled(MySelector)`
  margin-left: 1em;
  button {
    background-color: white;

    border: 1px solid black;
    border-radius: 2px;

    font-size: ${selectorFontSize};
    height: 4em;
    width: 14em;
    max-width: 90vh;
    padding: 0.6em 1em;
    margin: 0.2em;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding-left: 1.5em;

    &:focus {
      border: 1px solid ${colors.coolBlue};
    }
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
    <StyledDiv className={className}>
      <select
        onChange={(e) => {
          setDay(e.target.value as IDays);
        }}
      >
        {days.map((day) => (
          <option value={day}>{day}</option>
        ))}
      </select>
    </StyledDiv>
  );
};

const Name = ({ setName, className }: { setName: (name: string) => void; className?: string }) => {
  return (
    <StyledDiv className={className}>
      <input onChange={(e) => setName(e.target.value)} />
    </StyledDiv>
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
    <StyledDiv className={className}>
      <input onChange={(e) => setPhone(e.target.value)}></input>
    </StyledDiv>
  );
};

const StyledDays = styled(Days)`
  option {
    font-size: ${selectorFontSize};
    padding: 0.6em 1em;
  }
`;

const StyledName = styled(Name)`
  input {
    margin-top: 0.2em;
    font-size: ${inputFontSize};
    width: 14em;
    padding: 0.6em 1em;
  }
`;

const StyledPhoneNumber = styled(PhoneNumber)`
  input {
    font-size: ${inputFontSize};
    width: 14em;
    padding: 0.6em 1em;
  }
`;

const StartColumn = styled.div<{ marginTop?: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Confirm = styled.button`
  align-self: flex-start;
  padding: 1em 1.6em;
`;
type IDays = "Today" | "Tomorrow";

type ITimesObject = {
  [key in IDays]: string[];
};

export function ScheduleForm() {
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
    (async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_URL}/times`);
        const timesObject = (await result.json()) as ITimesObject;
        const dayss = Object.keys(timesObject);

        setDays(dayss as IDays[]);
        setTimes(timesObject);

        setIsLoading(false);
      } catch (e) {
        setHasError(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!times) return;

    setTime(times[day][0]);
  }, [times, day]);

  return (
    <Column>
      <FormWrapper>
        {isLoading && <>{isLoading}</>}
        {!isLoading && (
          <>
            <StartColumn marginTop={0.5}>
              {["Name", "Phone #", "Day", "Time"].map((item) => (
                <StyledDiv>{item}</StyledDiv>
              ))}
            </StartColumn>
            <StartColumn>
              <StyledName setName={setName} />
              <StyledPhoneNumber setPhone={setPhone} />
              {days && (
                <StyledDays setDay={setDay} days={Object.keys(times!) as unknown as IDays[]} />
              )}
              {times && time && <StyledTime time={time} setTime={setTime} times={times[day]} />}
              <StyledDiv>
                <Confirm
                  onClick={async () => {
                    await fetch(`${process.env.REACT_APP_URL}/newAppointment`, {
                      method: "post",
                      body: JSON.stringify({ day, time, barber, name, phone }),
                    });
                  }}
                >
                  Confirm
                </Confirm>
              </StyledDiv>
            </StartColumn>
          </>
        )}
      </FormWrapper>
    </Column>
  );
}
