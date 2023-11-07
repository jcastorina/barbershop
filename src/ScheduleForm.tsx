import { useState, useEffect } from "react";
import styled from "styled-components";
import { SyntaxKind } from "typescript";

const Column = styled.div`
  //background-color: white;
  display: flex;
  flex-direction: column;
  //  width: 20em;
`;

const FormWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: row;
  width: 20em;
`;

const StyledDiv = styled.div`
  margin-bottom: 1em;
  margin-left: 1em;
  height: 3em;
  font-weight: bold;

  select {
    display: flex;
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
  margin-bottom: 1em;

  select {
    width: 14em;
    padding: 0.6em 1em;
  }
`;
const StyledTime = styled(Time)`
  margin-bottom: 1em;

  select {
    width: 14em;
    padding: 0.6em 1em;
  }
`;

const StyledName = styled(Name)`
  margin-bottom: 1em;

  input {
    width: 14em;
    padding: 0.6em 1em;
  }
`;

const StyledPhoneNumber = styled(PhoneNumber)`
  margin-bottom: 1em;

  input {
    width: 14em;
    padding: 0.6em 1em;
  }
`;

const StartColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Confirm = styled.button`
  align-self: flex-start;
  padding: 1em 1.6em;
  margin-top: 0.6em;
`;

const days = ["Today", "Tomorrow"];
const times = ["10:00", "10:30", "11:00"];

export function ScheduleForm() {
  const [barber, setBarber] = useState("Mitch");
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState(days[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // const [employees, setEmployees] = useState([]);
  console.log(day, time, barber, name, phone);
  return (
    <Column>
      <FormWrapper>
        <StartColumn>
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
            <Confirm>Confirm</Confirm>
          </StyledDiv>
        </StartColumn>
      </FormWrapper>
    </Column>
  );
}
