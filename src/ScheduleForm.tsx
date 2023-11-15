import { useState, useEffect } from "react";
import styled from "styled-components";

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
  }
`;

const Days = ({
  days,
  setDay,
  className,
}: {
  days: string[];
  setDay: (day: string) => void;
  className?: string;
}) => {
  return (
    <StyledDiv className={className}>
      <select
        onChange={(e) => {
          setDay(e.target.value);
        }}
      >
        {days.map((day) => (
          <option value={day}>{day}</option>
        ))}
      </select>
    </StyledDiv>
  );
};

const Time = ({
  times,
  setTime,
  className,
}: {
  times: string[];
  setTime: (day: string) => void;
  className?: string;
}) => {
  return (
    <StyledDiv className={className}>
      <select
        onChange={(e) => {
          setTime(e.target.value);
        }}
      >
        {times.map((time) => (
          <option value={time}>{time}</option>
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
const StyledTime = styled(Time)`
  option {
    font-size: ${selectorFontSize};
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

const days = ["Today", "Tomorrow"];
const times = ["10:00", "10:30", "11:00"];

export function ScheduleForm() {
  const [barber, setBarber] = useState("Mitch");
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState(days[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  console.log(day, time, barber, name, phone);
  return (
    <Column>
      <FormWrapper>
        <StartColumn marginTop={0.5}>
          {["Name", "Phone #", "Day", "Time"].map((item) => (
            <StyledDiv>{item}</StyledDiv>
          ))}
        </StartColumn>
        <StartColumn>
          <StyledName setName={setName} />
          <StyledPhoneNumber setPhone={setPhone} />
          <StyledDays setDay={setDay} days={days} />
          <StyledTime setTime={setTime} times={times} />
          <StyledDiv>
            <Confirm
              onClick={async () => {
                console.log(process.env, "process");
              }}
            >
              Confirm
            </Confirm>
          </StyledDiv>
        </StartColumn>
      </FormWrapper>
    </Column>
  );
}
