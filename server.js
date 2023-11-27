const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ optionsSuccessStatus: 200, origin: "*" }));
app.use(express.text());

const PORT = 3001;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const data = {
  employees: [],
};

app.get("/employees", (req, res) => {
  if (typeof data.employees === "object") {
    res.status(200).write(JSON.stringify(data.employees));
    return res.end();
  }

  res.status(500).write("Failed to fetch employees");
  return res.end();
});

app.post("/deleteEmployee", (req, res) => {
  const employee = req.body;
  if (typeof employee === "string") {
    const employees = data.employees;
    const hasEmployee = employees.includes(employee);
    if (hasEmployee) {
      const idx = employees.indexOf(employee);
      let newArray;
      if (employees.length === 1) {
        newArray = [];
      } else {
        newArray = [...employees.slice(0, idx), ...employees.slice(idx + 1)];
      }

      if (typeof newArray === "object") {
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
  if (typeof req.body === "string") {
    const employee = req.body;
    data.employees.push(employee);

    res.status(200).write("Employee added successfully");
    return res.end();
  }
  res.status(200).write("Failed to add employee ", employee);
  return res.end();
});

//const pw = "jeffersonstreet1!";
const pw = "1";

app.post("/loginAdmin", (req, res) => {
  if (typeof req.body === "string") {
    if (req.body === pw) {
      res.status(200);
      return res.end();
    }
  }
  res.status(401);
  return res.end();
});

const makeHours = (start, hours) => {
  if (typeof start === "number" && typeof hours === "number") {
    let a = [];

    for (let i = 0; i < hours; i++) {
      for (let j = 0; j < 2; j++) {
        let offset = start + i;
        let str = `${offset > 12 ? offset - 12 : offset}:${j === 0 ? "00" : "30"} ${
          offset >= 12 ? "PM" : "AM"
        }`;
        a.push(str);
      }
    }

    return a;
  }

  return null;
};

const blankSched = {
  name: "",
  day: "",
  time: "",
  barber: "",
};

const buildSchedArray = () => {
  const hours = makeHours(9, 8);

  return hours.map((time) => ({ ...blankSched, time }));
};

const appts = {
  Today: buildSchedArray(),
  Tomorrow: buildSchedArray(),
};

app.get("/times", (req, res) => {
  const formattedTimes = {
    Today: appts.Today.map((item) => item.time),
    Tomorrow: appts.Tomorrow.map((item) => item.time),
  };
  res.write(JSON.stringify(formattedTimes));
  return res.end();
});

app.post("/newAppointment", (req, res) => {
  const result = JSON.parse(req.body);

  const { day, time, barber, name, phone } = result;

  const validation = {
    name: 0,
    phone: 0,
    day: 0,
    time: 0,
    barber: 0,
  };

  // need to make sure appt is available too

  if (day) validation.day = 1;
  if (time) validation.time = 1;
  if (barber) validation.barber = 1;
  if (name) validation.name = 1;
  if (phone) validation.phone = 1;

  const list = appts[day];
  const avail = list.includes(time);
  if (avail) {
    const idx = list.indexOf(time);

    if (idx === 0) {
      list.shift();
      appts[day] = list;
    } else {
      const newa = [...list.slice(0, idx), ...list.slice(idx + 1, list.length)];
      appts[day] = newa;
    }
  }

  res.write(JSON.stringify(validation));
  res.status(200);
  return res.end();
});
