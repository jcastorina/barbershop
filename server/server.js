require("dotenv").config();
const AWS = require("aws-sdk");
const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");
const path = require("path");
const https = require("https");
const fs = require("fs");
const uuid = require("uuid").v4;

//#region runtime setup

/**
 * TS Reference
 * 

  type DayKey = `day${number}`;

  type AppointmentDay = "Today" | DayKey;

  interface Appointment {
    day: AppointmentDay;
    time: string; // e.g. "8:00 AM"
    barber: string;
    name: string;
    phone: string;
    token: string; // UUID
  }

  interface DaySchedule {
    hours: [number, number];
    appts: Appointment[];
  }

  type Schedule = Record<DayKey, DaySchedule>;

 * 
 */


const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(cors({ optionsSuccessStatus: 200, origin: "*" }));
app.use(express.text());

const PORT = process.env.PORT || 3001;
const tz = process.env.TZ || "America/Chicago";

let Bucket = process.env.AWS_BUCKET;
let Filename //= process.env.AWS_SCHEDULE_FILE;
let scheduleJson;
let bulletin = null;

if (process.env.DEVELOPMENT === "true") {
  const obj = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  };
  AWS.config.update(obj);
  Filename = 'new-schedule-data.json' //process.env.AWS_SCHEDULE_FILE;
  app.listen(PORT, () => console.log(`app listening on port ${process.env.PORT || PORT}`));
} else {
  Filename = 'new-test-schedule-data.json' //process.env.AWS_PROD_SCHEDULE_FILE;
  const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, ".", "fullchain.pem")),
    key: fs.readFileSync(path.join(__dirname, ".", "privkey.pem")),
  };
  https.createServer(httpsOptions, app).listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
  });
}

const s3 = new AWS.S3();

//#endregion runtime setup

//#region time setup

let lastRequestTimestamp;

const setPersistentLastRequestTimestamp = (timestamp) => {
  fs.writeFileSync("./lastTimestamp.txt", timestamp.toISOString());
};

try {
  const rawTimestamp = fs.readFileSync("./lastTimestamp.txt").toString().trim();
  lastRequestTimestamp = moment.tz(rawTimestamp, moment.ISO_8601, tz);
  if (!lastRequestTimestamp.isValid()) {
    throw new Error("Invalid persisted timestamp");
  }
} catch (e) {
  lastRequestTimestamp = moment().tz(tz);
  setPersistentLastRequestTimestamp(lastRequestTimestamp);
}

let employees;
const setPersistentEmployees = (employees) => {
  fs.writeFileSync("./employees.txt", JSON.stringify(employees));
};

try {
  employees = JSON.parse(fs.readFileSync("./employees.txt").toString());
} catch (e) {
  employees = ["Mitch"];
  fs.writeFileSync("./employees.txt", JSON.stringify(employees));
}

const SCHEDULE_WINDOW_DAYS = 7;

const defaultSched = Object.freeze({
  0: null, // sun
  1: null, // mon
  2: [8, 18], // tues
  3: [8, 18], // wed
  4: [8, 18], // thurs
  5: [8, 18], // fri
  6: [8, 14], // sat
});

const makeDayIntoString = (dayNum, offset = 0) => ((dayNum + offset) % 7).toString();

const getCurrentDay = () => moment().tz(tz).day();

const makeScheduleKey = (offset) => `day${offset}`;

const buildEmptyDaySchedule = (baseDay, offset) => ({
  hours: defaultSched[makeDayIntoString(baseDay, offset)],
  appts: [],
});

const buildScheduleWindow = (baseDay = getCurrentDay()) => {
  let nextSchedule = {};

  for (let offset = 0; offset <= SCHEDULE_WINDOW_DAYS; offset++) {
    nextSchedule[makeScheduleKey(offset)] = buildEmptyDaySchedule(baseDay, offset);
  }

  return nextSchedule;
};

const normalizeSchedule = (rawSchedule = {}, baseDay = getCurrentDay()) => {
  const nextSchedule = buildScheduleWindow(baseDay);

  for (let offset = 0; offset <= SCHEDULE_WINDOW_DAYS; offset++) {
    const key = makeScheduleKey(offset);
    const rawDay = rawSchedule?.[key];

    if (!rawDay || typeof rawDay !== "object") {
      continue;
    }

    nextSchedule[key] = {
      hours: Array.isArray(rawDay.hours) ? rawDay.hours : nextSchedule[key].hours,
      appts: Array.isArray(rawDay.appts) ? rawDay.appts : [],
    };
  }

  return nextSchedule;
};

let schedule = buildScheduleWindow();

const makeHours = (start, hours) => {
  if (typeof start === "number" && typeof hours === "number") {
    let a = [];

    for (let i = 0; i < hours; i++) {
      for (let j = 0; j < 2; j++) {
        let offset = start + i;
        let str = `${offset > 12 ? offset - 12 : offset}:${j === 0 ? "00" : "30"} ${offset >= 12 ? "PM" : "AM"
          }`;
        a.push(str);
      }
    }

    return a;
  }

  return null;
};

const defaultHours = makeHours(8, 18);

//#endregion time setup

//#region time functions

const filterTimesAfterCurrent = (timesArray, tz) => {
  const currentTime = moment().tz(tz); //moment().tz(tz);

  return timesArray.filter((timeString) => {
    const timeMoment = moment.tz(
      `${currentTime.format("YYYY-MM-DD")} ${timeString}`,
      "YYYY-MM-DD h:mm A",
      tz
    );
    return timeMoment.isSameOrAfter(currentTime);
  });
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
// const removeTime = (times = [], time) => {
//   const idx = times.indexOf(time);
//   if (idx >= 0) {
//     if (times.length === 1) {
//       return [];
//     } else if (times.length === 2) {
//       if (idx === 0) {
//         return [times[1]];
//       } else {
//         return [times[0]];
//       }
//     } else if (idx === times.length - 1) {
//       return [...times.slice(0, times.length - 1)];
//     } else if (idx === 0) {
//       return [...times.slice(1, times.length)];
//     } else {
//       return [...times.slice(0, idx), ...times.slice(idx + 1, times.length)];
//     }
//   }
//   return [...times];
// };

const getAvailableTimes = (schedule) => {
  let employeeTimes = {};

  const getEmployeeAvailability = (employee, appts, hoursArray, day = "today") => {
    const myHours = appts.filter((appt) => appt.barber === employee);

    const hoursRemaining = day === "today" ? filterTimesAfterCurrent(hoursArray, tz) : hoursArray;
    const employeeAvailability = filterArray(
      hoursRemaining,
      myHours.map((appt) => appt.time)
    );
    return [...employeeAvailability];
  };

  employees.forEach((employee) => {
    employeeTimes[employee] = {};

    for (let offset = 0; offset <= SCHEDULE_WINDOW_DAYS; offset++) {
      const key = makeScheduleKey(offset);
      const daySchedule = schedule[key];
      const hoursRange = daySchedule?.hours;

      if (!hoursRange) {
        employeeTimes[employee][key] = null;
        continue;
      }

      const hoursArray = makeHours(hoursRange[0], hoursRange[1] - hoursRange[0]);

      employeeTimes[employee][key] = getEmployeeAvailability(
        employee,
        daySchedule.appts,
        hoursArray,
        offset === 0 ? "today" : key
      );
    }
  });

  return employeeTimes;
};

let _day = 0;

const addDay = (days) => {
  _day = days;
};

const checkDayElapsed = (tz) => {
  const currentTime = moment().tz(tz);
  const currentDay = currentTime.day();

  const daysElapsed = currentTime
    .clone()
    .startOf("day")
    .diff(lastRequestTimestamp.clone().startOf("day"), "days");

  lastRequestTimestamp = currentTime;
  setPersistentLastRequestTimestamp(lastRequestTimestamp);

  if (daysElapsed <= 0) {
    return;
  }

  if (daysElapsed > SCHEDULE_WINDOW_DAYS) {
    schedule = buildScheduleWindow(currentDay);
    return;
  }

  const nextSchedule = {};

  for (let offset = 0; offset <= SCHEDULE_WINDOW_DAYS; offset++) {
    const key = makeScheduleKey(offset);
    const sourceKey = makeScheduleKey(offset + daysElapsed);
    const sourceDay = schedule[sourceKey];

    nextSchedule[key] = {
      hours: sourceDay?.hours ?? buildEmptyDaySchedule(currentDay, offset).hours,
      appts: (sourceDay?.appts ?? []).map((appt) => ({
        ...appt,
        day: offset === 0 ? "Today" : key,
      })),
    };
  }

  schedule = nextSchedule;
};

//#endregion time functions

//#region bucket functions

async function uploadFile(Bucket, Body, Key = Filename) {
  const params = {
    Bucket,
    Key,
    Body: JSON.stringify(Body),
    ContentType: "application/json",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        // handle this?
        reject("error");
        console.log(err, err?.stack);
      } else {
        resolve("success");
      }
    });
  });
}

function getFile(Bucket, Key = Filename) {
  const params = {
    Bucket,
    Key,
  };

  s3.getObject(params, function (err, data) {
    if (err) {
      // handle this?
      console.log(err, err.stack);
    } else {
      scheduleJson = JSON.parse(data.Body.toString("utf-8"));
      schedule = normalizeSchedule(scheduleJson);
    }
  });
}

getFile(Bucket);

//#endregion bucket functions

//#region route handlers
app.get("/addDay/:id", (req, res) => {
  addDay(parseInt(req.params.id));
  res.status(200);
  return res.end();
});

app.get("/clientObject", (req, res) => {
  checkDayElapsed(tz);
  const timesObject = getAvailableTimes(schedule);

  const token = uuid();

  res.write(JSON.stringify({ barbers: { ...timesObject }, token }));
  return res.end();
});

app.get("/adminObject", (req, res) => {
  checkDayElapsed(tz);
  res.write(JSON.stringify(schedule));
  return res.end();
});

app.get("/get-bulletin", (req, res) => {
  res.write(typeof bulletin === "string" ? bulletin : "");
  return res.end();
});

app.post("/save-bulletin", (req, res) => {
  if (typeof req.body !== "string") {
    return res.status(400).end();
  }

  bulletin = req.body.trim();
  res.status(200);
  return res.end();
});

app.get("/delete-bulletin", (req, res) => {
  bulletin = null;
  res.status(200);
  return res.end();
});

app.get("/adminTodayAppts", (req, res) => {
  checkDayElapsed(tz);

  const sorted = schedule.day0.appts.sort((a, b) => {
    const h1 = defaultHours.indexOf(a.time);
    const h2 = defaultHours.indexOf(b.time);
    return h1 - h2;
  });
  res.write(JSON.stringify(sorted));

  return res.end();
});

app.get("/adminTomorrowAppts", (req, res) => {
  checkDayElapsed(tz);
  const sorted = schedule.day1.appts.sort((a, b) => {
    const h1 = defaultHours.indexOf(a.time);
    const h2 = defaultHours.indexOf(b.time);
    return h1 - h2;
  });
  res.write(JSON.stringify(sorted));

  return res.end();
});

app.post("/adminUpdateSchedule", async (req, res) => {
  checkDayElapsed(tz);
  const result = JSON.parse(req.body);
  const hasHours = (value) =>
    Boolean(value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "hours"));

  if (hasHours(result?.Today)) {
    schedule.day0.hours = result.Today.hours;
  }

  if (hasHours(result?.Tomorrow)) {
    schedule.day1.hours = result.Tomorrow.hours;
  }

  for (let offset = 0; offset <= SCHEDULE_WINDOW_DAYS; offset++) {
    const key = makeScheduleKey(offset);
    if (hasHours(result?.[key])) {
      schedule[key].hours = result[key].hours;
    }
  }

  await uploadFile(Bucket, schedule);

  res.status(200);
  return res.end();
});

app.post("/newAppointment", async (req, res) => {
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

  if (!schedule[day]) {
    return res.status(400).end();
  }

  const existingAppts = schedule[day].appts;

  const hasExisting = existingAppts.filter(
    (appt) => appt.barber === barber && appt.time === time
  ).length;

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

  await uploadFile(Bucket, schedule);

  res.status(200);
  return res.end();
});

app.post("/deleteAppointment", async (req, res) => {
  const token = req.body;

  Object.keys(schedule).forEach((dayKey) => {
    schedule[dayKey].appts = schedule[dayKey].appts.filter((appt) => appt.token !== token);
  });

  await uploadFile(Bucket, schedule);

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

app.post("/deleteEmployee", async (req, res) => {
  if (typeof req.body === "string") {
    const employee = req.body;
    const idx = employees.indexOf(employee);
    if (idx === 0 && employees.length < 2) {
      employees = [];
    } else {
      const head = employees.slice(0, idx);
      const tail = employees.slice(idx + 1, employees.length);
      employees = [...head, ...tail];
    }
    setPersistentEmployees(employees);

    Object.keys(schedule).forEach((day) => {
      schedule[day].appts = [
        ...schedule[day].appts.filter((record) => {
          return record.barber !== employee;
        }),
      ];
    });
    await uploadFile(Bucket, schedule);
    res.status(200);
  } else {
    res.status(401);
  }

  return res.end();
});

app.get("/employees", (req, res) => {
  res.write(JSON.stringify(employees));
  return res.end();
});

app.post("/addEmployee", (req, res) => {
  if (typeof req.body === "string") {
    employees.push(req.body);
    setPersistentEmployees(employees);
    res.status(200);
  } else {
    res.status(401);
  }

  res.end();
});

//#endregion route handlers
