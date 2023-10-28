import { useState, useEffect } from "react";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  background-color: white;
`;

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
  selectedDay: string;
  setSelectedDay: (c: string) => void;
}) {
  return <CalendarWrapper>Calendar Placeholder</CalendarWrapper>;
}
