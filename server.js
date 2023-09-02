const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.text());

const PORT = 3001;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const data = {
  employees: ["Mitch", "Steve", "Dave"],
};

app.get("/employees", (req, res) => {
  if (data.employees.length === 0) {
    res.status(200).write("There are no employees");
    return res.end();
  }
  if (typeof data.employees === "object" && data.employees.length) {
    res.status(200).write(JSON.stringify(data.employees));
    return res.end();
  }

  res.status(500).write("Failed to fetch employees");
  return res.end();
});

app.post("/deleteEmployee", (req, res) => {
  console.log(req.body);
  const employee = req.body;
  if (typeof employee === "string") {
    const employees = data.employees;
    const hasEmployee = employees.includes(employee);
    if (hasEmployee) {
      const idx = employees.indexOf(employee);
      const newArray = [...employees.slice(0, idx), ...employees.slice(idx + 1)];
      console.log(newArray, "new emp array");
      if (newArray.length && typeof newArray === "object") {
        data.employees = [...newArray];
        res.status(200).write("Employee deleted successfully");
        return res.end();
      }
    }
  }
  res.status(500).write("Failed to delete employee ", employee);
  return res.end();
});

app.post("/addEmployee", (req, res) => {
  console.log(req.body);
  if (typeof req.body === "string") {
    const employee = req.body;
    data.employees.push(employee);

    res.status(200).write("Employee added successfully");
    return res.end();
  }
  res.status(200).write("Failed to add employee ", employee);
  return res.end();
});

const pw = "jeffersonstreet1!";

app.post("/loginAdmin", (req, res) => {
  console.log(req.body, "login");
  if (typeof req.body === "string") {
    if (req.body === pw) {
      res.status(200);
      return res.end();
    }
  }
  res.status(401);
  return res.end();
});
