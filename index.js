const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");

const app = express();

app.use(cors({ optionsSuccessStatus: 200, origin: "*" }));
app.use(express.text());

const PORT = 3001;
const tz = "America/Los_Angeles";

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

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
  }

  if (Tomorrow) {
  }

  return { Today, Tomorrow };
};

app.get("/clientObject", (req, res) => {
  const timesObject = getAvailableTimes(schedule);

  res.write(JSON.stringify(timesObject));
  return res.end();
});

app.get("/adminObject", (req, res) => {
  res.write(JSON.stringify(schedule));
  return res.end();
});
