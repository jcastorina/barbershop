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

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(cors({ optionsSuccessStatus: 200, origin: "*" }));
app.use(express.text());

const PORT = process.env.PORT || 3001;
const tz = process.env.TZ || "America/Chicago";

let mode = "init";

let Bucket = process.env.AWS_BUCKET;
let Filename = process.env.AWS_SCHEDULE_FILE;
let scheduleJson;

if (process.env.DEVELOPMENT === "true") {
  const obj = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  };
  AWS.config.update(obj);
  Filename = process.env.AWS_SCHEDULE_FILE;
  app.listen(PORT, () => console.log(`app listening on port ${process.env.PORT || PORT}`));
} else {
  Filename = process.env.AWS_PROD_SCHEDULE_FILE;
  const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, "./api.jeffersonstreet.com", "fullchain.pem")),
    key: fs.readFileSync(path.join(__dirname, "./api.jeffersonstreet.com", "privkey.pem")),
  };
  https.createServer(httpsOptions, app).listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
  });
}

const s3 = new AWS.S3();

//#endregion runtime setup

//#region time setup

let date = moment().tz(tz);
let lastRequestTimestamp;

const setPersistentLastRequestTimestamp = (timestamp) => {
  fs.writeFileSync("./lastTimestamp.txt", timestamp.toString());
};

try {
  lastRequestTimestamp = moment(fs.readFileSync("./lastTimestamp.txt").toString()).tz(tz);
} catch (e) {
  lastRequestTimestamp = moment().tz(tz);
  fs.writeFileSync("./lastTimestamp.txt", date.toString());
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

const day = date.day();

const defaultSched = Object.freeze({
  0: null,
  1: null,
  2: [8, 18],
  3: [8, 18],
  4: [8, 18],
  5: [8, 18],
  6: [8, 14],
});

let schedule = {
  day0: {
    hours: day !== 0 || day !== 1 ? defaultSched[day.toString()] : null,
    appts: [],
  },
  day1: {
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
  day2: { hours: null, appts: [] },
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
  const todayHoursRange = schedule.day0.hours;
  const tomorrowHoursRange = schedule.day1.hours;

  const todayAppts = schedule.day0.appts;
  const tomorrowAppts = schedule.day1.appts;
  let employeeTimes = {};

  let todayHoursArray = null;
  let tomorrowHoursArray = null;

  if (todayHoursRange) {
    todayHoursArray = makeHours(todayHoursRange[0], todayHoursRange[1] - todayHoursRange[0]);
  }

  if (tomorrowHoursRange) {
    tomorrowHoursArray = makeHours(
      tomorrowHoursRange[0],
      tomorrowHoursRange[1] - tomorrowHoursRange[0]
    );
  }
  const getEmployeeAvailability = (employee, appts, hoursArray, day = "today") => {
    const myHours = appts.filter((appt) => appt.barber === employee);

    const hoursRemaining = day === "today" ? filterTimesAfterCurrent(hoursArray, tz) : hoursArray;
    const employeeAvailability = filterArray(
      hoursRemaining,
      myHours.map((appt) => appt.time)
    );
    return [...employeeAvailability];
  };
  if (todayHoursArray) {
    employees.forEach((employee) => {
      employeeTimes[employee] = {
        day0: getEmployeeAvailability(employee, todayAppts, todayHoursArray, "today"),
        day1: null,
      };
    });
  } else {
    employees.forEach((employee) => {
      employeeTimes[employee] = {
        day0: null,
        day1: null,
      };
    });
  }

  if (tomorrowHoursArray) {
    employees.forEach((employee) => {
      employeeTimes[employee]["day1"] = getEmployeeAvailability(
        employee,
        tomorrowAppts,
        tomorrowHoursArray,
        "tomorrow"
      );
    });
  }

  // Today = filterTimesAfterCurrent(Today, tz);
  // if (today.length) {
  //   Today = filterArray(
  //     Today,
  //     today.map((appt) => appt.time)
  //   );
  // }
  // if (todayHoursRange && todayHoursRange[1] >= 15) {
  //   const removedArray = removeTime(Today, "12:30 PM");
  //   if (removedArray) {
  //     Today = removedArray;
  //   }
  // }

  // if (Tomorrow && tomorrow.length) {
  //   Tomorrow = filterArray(
  //     Tomorrow,
  //     tomorrow.map((appt) => appt.time)
  //   );
  // }
  // if (tomorrowHoursRange && tomorrowHoursRange[1] >= 15) {
  //   const removedArray = removeTime(Tomorrow, "12:30 PM");
  //   if (removedArray) {
  //     Tomorrow = removedArray;
  //   }
  // }

  //return { Today, Tomorrow };

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
  const todayHours = defaultSched[currentDay] ? [...defaultSched[currentDay]] : null;
  const tomorrowHours = defaultSched[(currentDay + 1) % 7]
    ? [...defaultSched[(currentDay + 1) % 7]]
    : null;

  lastRequestTimestamp = currentTime;
  setPersistentLastRequestTimestamp(lastRequestTimestamp);

  if (daysElapsed === 1) {
    const appts = [...schedule.day1.appts].map((appt) => ({ ...appt, day: "Today" }));
    schedule.day1.appts = appts;
    schedule.day0 = { ...schedule.day1 };
    schedule.day1.appts = [];
    schedule.day1.hours = tomorrowHours;
    return;
  }

  if (daysElapsed > 1) {
    schedule.day0.appts = [];
    schedule.day0.hours = todayHours;
    schedule.day1.appts = [];
    schedule.day1.hours = tomorrowHours;
    return;
  }
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
      schedule = scheduleJson;
      mode = "ready";
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

app.post("/adminUpdateSchedule", (req, res) => {
  checkDayElapsed(tz);
  const result = JSON.parse(req.body);

  const { Today: day0, Tomorrow: day1 } = result;
  schedule.day0.hours = day0.hours;
  schedule.day1.hours = day1.hours;

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

app.post("/deleteAppointment", (req, res) => {
  const token = req.body;

  schedule.day0.appts = schedule.day0.appts.filter((appt) => appt.token !== token);
  schedule.day1.appts = schedule.day1.appts.filter((appt) => appt.token !== token);

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
