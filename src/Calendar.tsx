import { useState, useEffect } from "react";
import styled from "styled-components";
import { SyntaxKind } from "typescript";

const CalendarWrapper = styled.div`
  background-color: white;
`;

const days = ["Today", "Tomorrow"];

const Today = styled.img`
  height: 2.5em;
  border: 1px solid red;
  position: absolute;
`;
const Tomorrow = styled.img`
  height: 2em;
  border: 1px solid red;
  position: absolute;
`;

const Day = ({ selectedDay, className }: { selectedDay: number; className?: string }) => (
  <div className={className}>
    {selectedDay ? (
      <>
        <Today src={"today.png"} />
        {/* {">"} */}
      </>
    ) : (
      <>
        {/* {"<"} */}
        <Tomorrow src={"tomorrow.png"} />
      </>
    )}
  </div>
);

const StyledDay = styled(Day)`
  width: 100%;
`;

const Days = ({
  days,
  selectedDay,
  className,
  onClick,
}: {
  days: string[];
  selectedDay: number;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div onClick={onClick} className={className}>
      <Day selectedDay={selectedDay} />
    </div>
  );
};

const StyledDays = styled(Days)``;

export function Calendar({
  employees,
  selectedBarber,
  setSelectedBarber,
  selectedDay,
  setSelectedDay,
}: {
  employees: string[];
  selectedBarber: string;
  setSelectedBarber: (c: string) => void;
  selectedDay: number;
  setSelectedDay: (c: number) => void;
}) {
  return (
    <CalendarWrapper>
      <StyledDays
        onClick={() => setSelectedDay(selectedDay ? 0 : 1)}
        selectedDay={selectedDay}
        days={days}
      />
    </CalendarWrapper>
  );
}
