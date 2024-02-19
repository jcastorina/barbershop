require("dotenv").config();
const AWS = require("aws-sdk");
const bucket = process.env.AWS_BUCKET;
const filename = process.env.AWS_SCHEDULE_FILE;
const obj = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
AWS.config.update(obj);

const s3 = new AWS.S3();

function uploadFile(Bucket, Body, Key = filename) {
  const params = {
    Bucket,
    Key,
    Body,
    ContentType: "application/json",
  };

  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
}

function getFile(Bucket, Key = filename) {
  const params = {
    Bucket,
    Key,
  };

  s3.getObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      const $data = JSON.parse(data.Body.toString("utf-8"));
      console.log($data, "data");
      $data["new"] = "new value";
      uploadFile(Bucket, JSON.stringify($data));
    }
  });
}

const blankSched = { name: "Joey", phone: 9998887777 };

function setInit() {
  const params = {
    Bucket: bucket,
    Key: "test-schedule-data.json",
    Body: JSON.stringify({
      0: [
        { ...blankSched, time: "5:00 PM", barber: "mitch" },
        { ...blankSched, time: "5:30 PM", barber: "steve" },
      ],
      1: [
        { ...blankSched, time: "9:00 AM", barber: "mitch" },
        { ...blankSched, time: "2:00 PM", barber: "steve" },
        { ...blankSched, time: "3:00 PM", barber: "steve" },
      ],
      2: [{}],
    }),
    ContentType: "application/json",
  };

  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
}

setInit();

// getFile(bucket);
