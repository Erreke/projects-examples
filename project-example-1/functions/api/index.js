const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const getUserDataByEmail = require('./v1/routes/get-user-data-by-email');
const getBeneficiarByEmail = require('./v1/routes/get-beneficiar-by-email');
const deleteUser = require('./v1/routes/delete-user');
const createClient = require('./v1/routes/create-client');
const registration = require('./v1/routes/registration');
const signUpToWebinar = require('./v1/routes/sign-up-to-webinar');
const sendVerificationCode = require('./v1/routes/send-verification-code');
const updateBusinessPlace = require('./v1/routes/update-business-place');
const fetchCities = require('./v1/routes/fetch-cities');
const saveSelectedPackageAndGetPayUrl = require('./v1/routes/save-selected-package-and-get-pay-url');
const getWebinarRecording = require('./v1/routes/get-webinar-recording');
const enrollToWebinar = require('./v1/routes/enroll-to-webinar');
const recoverEmailInProfile = require("./v1/routes/recover-email-in-profile");

const app = express();

module.exports = function() {
  app.use(cors({ origin: true }));
  app.use(bodyParser.json());
  app.disable('x-powered-by');

  app.post('/api/v1/get-user-data-by-email/', getUserDataByEmail);
  app.post('/api/v1/delete-user/', deleteUser);
  app.post('/api/v1/create-client/', createClient);
  app.post('/api/v1/registration/', registration);
  app.post('/api/v1/sign-up-to-webinar/', signUpToWebinar);
  app.post('/api/v1/send-verification-code/', sendVerificationCode);
  app.post('/api/v1/get-webinar-recording/', getWebinarRecording);
  app.get('/api/v1/get-beneficiar-by-email/', getBeneficiarByEmail);
  app.get('/api/v1/update-business-place/', updateBusinessPlace);
  app.get('/api/v1/fetch-cities/', fetchCities);
  app.post('/api/v1/save-selected-package-and-get-pay-url/', saveSelectedPackageAndGetPayUrl);
  app.post('/api/v1/enroll-to-webinar/', enrollToWebinar);
  app.post('/api/v1/recover-email-in-profile/', recoverEmailInProfile);

  return app;
}
