  import { useState, useEffect } from "react";
  import styled from "styled-components";

  const Wrapper = styled.div`
    height: 100vh;
    background-color: white;

  display: grid;
  place-items: center;
  `;

  const employees = ["Mitch", "Steve", "Paul"];

  const day = ["Today", "Tomorrow"];

  const Selector = styled.button<{ selected: boolean }>`
    background-color: ${props => props.selected ? "green" : "lightgreen"};

    height: 3em;
    width: 6em;
  `;

  const SelectorContainer = styled.div`
    align-self: flex-start;
  `;

  const CalendarContainer = styled.div``;

  const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;

  `;

  function App() {

    const [selectedBarber, setSelectedBarber] = useState("Mitch");
      const [selectedDay, setSelectedDay] = useState("Today");

    useEffect(() => {
      const pathname = window.location.pathname;
      console.log(pathname, "pathname");

      if (pathname === "/admin") {
        console.log("admin");

      }

    //   (async () => { 
    //     console.log("running the async")
    //     try {
    //       const response = await fetch("http://127.0.0.1:3001/deleteEmployee", { method: "post", body: "Steve", headers: {
    //     "Content-Type": "text/plain"
    // },});
    //       if (response.ok) {
    //                 const body = await response.text();
    //       console.log(body, "result");
    //       } else {
    //         throw new Error("failed");
    //       }

    //     } catch (e) {
    //       console.log("failed")
    //     }
        
    //   })();
    }, [])

    const [addEmployee, setAddEmployee] = useState("");
    const [deleteEmployee, setDeleteEmployee] = useState("");
    
    return (
      <Wrapper>
        <WidgetContainer>
          <span><input placeholder="employee name" value={addEmployee} onChange={(e) => setAddEmployee(e.target.value)} /> <button disabled={!addEmployee} onClick={async () => {
            if (addEmployee) {
              const result = await fetch("http://127.0.0.1:3001/addEmployee", { method: "post", headers: { "Content-Type": "text/plain" }, body: addEmployee });
              const text = await result.text();
              setAddEmployee("");
              console.log(text);
            }
          }}>Add</button></span>
                    <span><input placeholder="employee name" value={deleteEmployee} onChange={(e) => setDeleteEmployee(e.target.value)} /> <button disabled={!deleteEmployee} onClick={async () => {
            if (deleteEmployee) {
              try {
              const result = await fetch("http://127.0.0.1:3001/deleteEmployee", { method: "post", headers: { "Content-Type": "text/plain" }, body: deleteEmployee });
              const text = await result.text();
              setDeleteEmployee("");
              console.log(text);
              } catch (e) {
                console.log("No employee found!")
              }

            }
          }}>Delete</button></span>
          <button onClick={async () => {
            const result = await fetch("http://127.0.0.1:3001/employees");
            const text = await result.text();
            const employees = JSON.parse(text);
            console.log(employees);
        }}>Get Employees</button>
        <SelectorContainer>
          {employees.map(employee => <Selector onClick={() => setSelectedBarber(employee)} selected={selectedBarber === employee}>{employee}</Selector>)}
          </SelectorContainer>
                <SelectorContainer>
          {day.map(day => <Selector onClick={() => setSelectedDay(day)} selected={selectedDay === day}>{day}</Selector>)}
          </SelectorContainer>
          <CalendarContainer></CalendarContainer>
        </WidgetContainer>

      </Wrapper>
    );
  }

  export default App;
