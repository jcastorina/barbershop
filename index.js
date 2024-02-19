require("dotenv").config();
const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");
const path = require("path");
const uuid = require("uuid").v4;
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
console.log("force");
const PORT = 3001;
const tz = process.env.TZ || "America/Chicago";

const getWithOffset = (tz) => {
  return moment().tz(tz);
};

// THIS ONLY GETS USED LOCALLY NOW
// DEPLOYED EXPRESS USES https
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// https.createServer(httpsOptions, app).listen(PORT, function () {
//   console.log(`Express server listening on port ${PORT}`);
// });

const filterTimesAfterCurrent = (timesArray, tz) => {
  const currentTime = getWithOffset(tz); //moment().tz(tz);

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
  0: [8, 11],
  1: [8, 12],
  2: [8, 13],
  3: [8, 14],
  4: [8, 15],
  5: [8, 16],
  6: [8, 17],
});

const defaultHours = makeHours(8, 18);

const date = getWithOffset(tz); // moment().tz(tz);
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
      // { name: "joey", phone: 1234657890, time: "9:00 AM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "10:00 AM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "2:30 PM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "12:00 PM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "12:30 PM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "1:00 PM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "2:00 PM", barber: "mitch" },
      // { name: "joey", phone: 1234657890, time: "3:00 PM", barber: "mitch" },
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

const removeTime = (times = [], time) => {
  const idx = times.indexOf(time);
  if (idx >= 0) {
    if (times.length === 1) {
      return [];
    } else if (times.length === 2) {
      if (idx === 0) {
        return [times[1]];
      } else {
        return [times[0]];
      }
    } else if (idx === times.length - 1) {
      return [...times.slice(0, times.length - 1)];
    } else if (idx === 0) {
      return [...times.slice(1, times.length)];
    } else {
      return [...times.slice(0, idx), ...times.slice(idx + 1, times.length)];
    }
  }
  return [...times];
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

let lastRequestTimestamp = getWithOffset(tz);

const checkDayElapsed = (tz) => {
  const currentTime = getWithOffset(tz);
  const currentDay = currentTime.day();
  const daysElapsed = currentTime
    .clone()
    .startOf("day")
    .diff(lastRequestTimestamp.clone().startOf("day"), "days");
  const todayHours = defaultSched[currentDay] ? [...defaultSched[currentDay]] : null;
  const tomorrowHours = defaultSched[(currentDay + 1) % 7]
    ? [...defaultSched[(currentDay + 1) % 7]]
    : null;

  lastRequestTimestamp = currentTime;
  if (daysElapsed === 1) {
    const appts = [...schedule.Tomorrow.appts].map((appt) => ({ ...appt, day: "Today" }));
    schedule.Tomorrow.appts = appts;
    schedule.Today = { ...schedule.Tomorrow };
    schedule.Tomorrow.appts = [];
    schedule.Tomorrow.hours = tomorrowHours;
    return;
  }

  if (daysElapsed > 1) {
    schedule.Today.appts = [];
    schedule.Today.hours = todayHours;
    schedule.Tomorrow.appts = [];
    schedule.Tomorrow.hours = tomorrowHours;
    return;
  }
};

app.get("/addDay/:id", (req, res) => {
  addDay(parseInt(req.params.id));
  res.status(200);
  return res.end();
});

app.get("/clientObject", (req, res) => {
  checkDayElapsed(tz);
  const timesObject = getAvailableTimes(schedule);
  const token = uuid();

  res.write(JSON.stringify({ ...timesObject, token }));
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

  const { day, time, barber, name, phone, token } = result;

  if (
    typeof day !== "string" ||
    typeof time !== "string" ||
    typeof barber !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof token !== "string"
  ) {
    return res.status(400);
  }

  const existingAppts = schedule[day].appts;

  const hasExisting = existingAppts.filter((appt) => appt.time === time).length;

  if (hasExisting) {
    res.status(409);
    return res.end();
  }

  const appointmentRecord = {
    day,
    time,
    barber,
    name,
    phone,
    token,
  };

  schedule[day].appts.push(appointmentRecord);

  res.status(200);
  return res.end();
});

app.post("/deleteAppointment", (req, res) => {
  const token = req.body;

  schedule.Today.appts = schedule.Today.appts.filter((appt) => appt.token !== token);
  schedule.Tomorrow.appts = schedule.Tomorrow.appts.filter((appt) => appt.token !== token);

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
