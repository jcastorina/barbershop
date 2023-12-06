const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");

const tz = "America/Los_Angeles";

const filterTimesAfterCurrentCentral = (timesArray, tz) => {
  const currentTime = moment().tz(tz);

  return timesArray.filter((timeString) => {
    const timeMoment = moment.tz(
      `${currentTime.format("YYYY-MM-DD")} ${timeString}`,
      "YYYY-MM-DD h:mm A",
      tz
    );

    return timeMoment.isSameOrAfter(currentTime);
  });
};

const getWeekdaysWithDates = (tz) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    // Using 'moment' to get the current day and adding 'i' days to it
    const date = moment().tz(tz).add(i, "days");
    // Formatting the date as 'dddd MM/DD' (Day of week, Month/Day)
    dates.push({ name: date.format("dddd M/D"), day: date.day() });
  }

  return dates;
};

const makeInitialHoursObject = (tz) => {
  const dates = getWeekdaysWithDates(tz);

  const hours = {};

  dates.forEach((date, i) => {
    hours[i] = {
      name: date.name,
      dayNum: date.day,
      start: 8,
      end: date.day === 6 ? 6 : 10,
      closed: date.day === 0 || date.day === 1 ? true : false,
    };
  });

  return hours;
};

const hours = makeInitialHoursObject(tz);

const getTodayAndTomorrowDates = () => {
  const today = moment().format("M/D");

  const tomorrow = moment().add(1, "days").format("M/D");

  return [today, tomorrow];
};

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

app.get("/adminTimeList", (req, res) => {
  console.log("requesting time list");
  res.write(JSON.stringify(hours));
  return res.end();
});

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
  const hours = makeHours(9, 15);

  return hours.map((time) => ({ ...blankSched, time }));
};

const appts = {
  Today: buildSchedArray(),
  Tomorrow: buildSchedArray(),
};

app.get("/times", (req, res) => {
  const _appt = appts.Today.map((item) => item.time);

  const filteredTimes = filterTimesAfterCurrentCentral(_appt, tz);

  const [today, tomorrow] = getTodayAndTomorrowDates();

  const formattedTimes = {
    [`Today ${today}`]: filteredTimes,
    [`Tomorrow ${tomorrow}`]: appts.Tomorrow.map((item) => item.time),
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
