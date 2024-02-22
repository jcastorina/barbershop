import { FormEvent, useEffect, useState } from "react";

export const EmployeeRoster = () => {
  const [employees, setEmployees] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function deleteEmployee(employee: string) {
    return await fetch(`${process.env.REACT_APP_URL}/deleteEmployee`, {
      method: "post",
      headers: { "Content-Type": "text/plain" },
      body: employee,
    });
  }

  async function addEmployee(employee: string) {
    return await fetch(`${process.env.REACT_APP_URL}/addEmployee`, {
      method: "post",
      headers: { "Content-Type": "text/plain" },
      body: employee,
    });
  }

  useEffect(() => {
    if (!isLoading) return;
    (async () => {
      const url = `${process.env.REACT_APP_URL}/employees`;
      console.log(url);
      const result = await fetch(url);
      const employees = await result.json();

      //   const employees = JSON.parse(text);
      if (typeof employees === "object") {
        setEmployees(employees);
      }
    })().finally(() => setIsLoading(false));
  }, [isLoading]);

  return (
    <>
      {" "}
      <h2>Roster</h2>
      <span>
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const employee = (e.currentTarget.elements[0] as HTMLInputElement).value;
            void addEmployee(employee).finally(() => setIsLoading(true));
          }}
        >
          <input
            placeholder="employee name"
            style={{ marginBottom: "1.3em" }}
            disabled={employees.length > 4}
          />
          <button type="submit" disabled={employees.length > 4}>
            Add
          </button>
        </form>
      </span>
      {employees.length
        ? employees.map((employee) => (
            <div>
              <b>
                <span>
                  <i>{employee}</i>
                </span>
              </b>
              <button
                onClick={async () => {
                  void deleteEmployee(employee)
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => setIsLoading(true));
                }}
              >
                Delete Employee
              </button>
            </div>
          ))
        : "No employees found"}
    </>
  );
};
