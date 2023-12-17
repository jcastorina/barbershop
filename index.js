const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");
const { networkInterfaces } = require("os");
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
  0: null,
  1: null,
  2: [8, 18],
  3: [8, 18],
  4: [8, 18],
  5: [8, 18],
  6: [8, 14],
});

const defaultHours = makeHours(8, 18);

const date = moment().tz(tz);
const day = date.day();

const schedule = {
  Today: {
    hours: day !== 0 || day !== 1 ? defaultSched[day.toString()] : null,
    appts: [],
  },
  Tomorrow: {
    hours: day !== 0 || day !== 1 ? defaultSched[((day + 1) % 7).toString()] : null,
    appts: [
      // { name: "joe", phone: 1234567890, time: "10:30 AM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "9:30 AM", barber: "mitch" },
      // { name: "jooe", phone: 2234657890, time: "3:30 PM", barber: "mitch" },
      // { name: "jsadgooe", phone: 2234659990, time: "1:30 PM", barber: "mitch" },
    ],
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

const removeTime = (times, time) => {
  const idx = times.indexOf(time);
  if (!idx) {
    return null;
  }
  return [...times.slice(0, idx), ...times.slice(idx + 1, times.length)];
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
    if (todayHoursRange && todayHoursRange[1] >= 15) {
      const removedArray = removeTime(Today, "11:30 AM");
      if (removedArray) {
        Today = removedArray;
      }
    }
  }

  if (Tomorrow && tomorrow.length) {
    Tomorrow = filterArray(
      Tomorrow,
      tomorrow.map((appt) => appt.time)
    );
  }
  if (tomorrowHoursRange && tomorrowHoursRange[1] >= 15) {
    const removedArray = removeTime(Tomorrow, "11:30 AM");
    if (removedArray) {
      Tomorrow = removedArray;
    }
  }

  return { Today, Tomorrow };
};

let lastRequestTimestamp = moment.tz(tz).format();

// let m = moment.tz(tz).add(1, "days");

const checkDayElapsed = (tz) => {
  const lastRequestTime = moment(lastRequestTimestamp);

  const currentTime = moment().tz(tz);

  const daysElapsed = currentTime.diff(lastRequestTime, "days");

  lastRequestTimestamp = currentTime.format();
  if (daysElapsed >= 1) {
    if (daysElapsed === 1) {
      schedule.Today = { ...schedule.Tomorrow };
      const newDayTomorrow = defaultSched[(currentTime.day() + 1) % 7]
        ? [...defaultSched[(currentTime.day() + 1) % 7]]
        : null;
      schedule.Tomorrow = { hours: newDayTomorrow, appts: [] };
    } else {
      const newDayToday = defaultSched[currentTime.day()]
        ? [...defaultSched[currentTime.day()]]
        : null;
      const newDayTomorrow = defaultSched[(currentTime.day() + 1) % 7]
        ? [...defaultSched[(currentTime.day() + 1) % 7]]
        : null;
      schedule.Today = { hours: newDayToday, appts: [] };
      schedule.Tomorrow = { hours: newDayTomorrow, appts: [] };
      console.log(daysElapsed, schedule, "2 days");
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
  checkDayElapsed(tz);

  const sorted = schedule.Today.appts.sort((a, b) => {
    const h1 = defaultHours.indexOf(a.time);
    const h2 = defaultHours.indexOf(b.time);
    return h1 - h2;
  });
  res.write(JSON.stringify(sorted));

  return res.end();
});

app.get("/adminTomorrowAppts", (req, res) => {
  checkDayElapsed(tz);

  const sorted = schedule.Tomorrow.appts.sort((a, b) => {
    const h1 = defaultHours.indexOf(a.time);
    const h2 = defaultHours.indexOf(b.time);
    return h1 - h2;
  });
  res.write(JSON.stringify(sorted));

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
