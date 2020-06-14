const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const registration = require("./v1/routes/registration");
const sendVerificationCode = require("./v1/routes/send-verification-code");
const fetchCities = require("./v1/routes/fetch-cities");
const recoverEmailInProfile = require("./v1/routes/recover-email-in-profile");

const app = express();

module.exports = function() {
  app.use(cors({ origin: true }));
  app.use(bodyParser.json());
  app.disable("x-powered-by");

  app.post("/api/v1/registration/", registration);
  app.post("/api/v1/send-verification-code/", sendVerificationCode);
  app.get("/api/v1/fetch-cities/", fetchCities);
  app.post("/api/v1/recover-email-in-profile/", recoverEmailInProfile);

  return app;
};
