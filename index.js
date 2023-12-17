const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");
const path = require("path");
// const https = require("https");
// const fs = require("fs");

const app = express();

// const httpsOptions = {
//   cert: fs.readFileSync(path.join(__dirname, "---")),
//   key: fs.readFileSync(path.join(__dirname, "---")),
// };

app.use(express.static(path.join(__dirname, "build")));
app.use(cors({ optionsSuccessStatus: 200, origin: "*" }));
app.use(express.text());

const PORT = 3001;
const tz = "America/Los_Angeles";

// THIS ONLY GETS USED LOCALLY NOW
// DEPLOYED EXPRESS USES https
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// https.createServer(httpsOptions, app).listen(PORT, function () {
//   console.log(`Express server listening on port ${PORT}`);
// });

const filterTimesAfterCurrent = (timesArray, tz) => {
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

const defaultSched = Object.freeze({
  0: [8, 17],
  1: null,
  2: [8, 17],
  3: [8, 17],
  4: [8, 17],
  5: [8, 17],
  6: [8, 14],
});

const date = moment().tz(tz);
const day = date.day();

const schedule = {
  Today: {
    hours: day !== 0 || day !== 1 ? defaultSched[day.toString()] : null,
    appts: [],
  },
  Tomorrow: {
    hours: day !== 0 || day !== 1 ? defaultSched[((day + 1) % 7).toString()] : null,
    appts: [],
  },
};

const filterArray = (array1, array2) => {
  let res = [];

  for (let i = 0; i < array1.length; i++) {
    let contains = false;
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] === array2[j]) {
        contains = true;
      }
    }
    if (!contains) {
      res.push(array1[i]);
    }
  }
  return res;
};

const getAvailableTimes = (schedule) => {
  const todayHoursRange = schedule.Today.hours;
  const tomorrowHoursRange = schedule.Tomorrow.hours;

  const today = schedule.Today.appts;
  const tomorrow = schedule.Tomorrow.appts;

  let Today = null;
  let Tomorrow = null;

  if (todayHoursRange) {
    Today = makeHours(todayHoursRange[0], todayHoursRange[1] - todayHoursRange[0]);
  }

  if (tomorrowHoursRange) {
    Tomorrow = makeHours(tomorrowHoursRange[0], tomorrowHoursRange[1] - tomorrowHoursRange[0]);
  }

  if (Today) {
    Today = filterTimesAfterCurrent(Today, tz);
    if (today.length) {
      Today = filterArray(
        Today,
        today.map((appt) => appt.time)
      );
    }
  }

  if (Tomorrow && tomorrow.length) {
    Tomorrow = filterArray(
      Tomorrow,
      tomorrow.map((appt) => appt.time)
    );
  }

  return { Today, Tomorrow };
};

let lastRequestTimestamp = moment.tz(tz).format();

const checkDayElapsed = (tz) => {
  const lastRequestTime = moment(lastRequestTimestamp);

  const currentTime = moment().tz(tz);

  const daysElapsed = currentTime.diff(lastRequestTime, "days");

  console.log(daysElapsed);
  lastRequestTimestamp = currentTime.format();
  if (daysElapsed >= 1) {
    if (daysElapsed === 1) {
      schedule.Today = { ...schedule.Tomorrow };
      const newDayTomorrow = defaultSched[(currentTime.day + 1) % 7]
        ? [...defaultSched[(currentTime.day + 1) % 7]]
        : null;
      schedule.Tomorrow = { hours: newDayTomorrow, appts: [] };
    } else {
      const newDayToday = defaultSched[currentTime.day] ? [...defaultSched[currentTime.day]] : null;
      const newDayTomorrow = defaultSched[(currentTime.day + 1) % 7]
        ? [...defaultSched[(currentTime.day + 1) % 7]]
        : null;
      schedule.Today = { hours: newDayToday, appts: [] };
      schedule.Tomorrow = { hours: newDayTomorrow, appts: [] };
    }
    return daysElapsed;
  } else {
    return 0;
  }
};

app.get("/clientObject", (req, res) => {
  checkDayElapsed(tz);
  const timesObject = getAvailableTimes(schedule);

  res.write(JSON.stringify(timesObject));
  return res.end();
});

app.get("/adminObject", (req, res) => {
  checkDayElapsed(tz);
  res.write(JSON.stringify(schedule));
  return res.end();
});

app.get("/adminTodayAppts", (req, res) => {
  res.write(JSON.stringify(schedule.Today.appts));
  return res.end();
});

app.get("/adminTomorrowAppts", (req, res) => {
  res.write(JSON.stringify(schedule.Tomorrow.appts));
  return res.end();
});

app.post("/adminUpdateSchedule", (req, res) => {
  checkDayElapsed(tz);
  const result = JSON.parse(req.body);

  const { Today, Tomorrow } = result;

  schedule.Today.hours = Today.hours;
  schedule.Tomorrow.hours = Tomorrow.hours;

  res.status(200);
  return res.end();
});

app.post("/newAppointment", (req, res) => {
  const result = JSON.parse(req.body);

  const { day, time, barber, name, phone } = result;

  if (
    typeof day !== "string" ||
    typeof time !== "string" ||
    typeof barber !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string"
  ) {
    return res.status(400);
  }

  const appointmentRecord = {
    day,
    time,
    barber,
    name,
    phone,
  };

  schedule[day].appts.push(appointmentRecord);

  res.status(200);
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
