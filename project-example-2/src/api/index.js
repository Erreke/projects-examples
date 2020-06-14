import axios from "axios";
import { HOST } from "@/config";

const { CancelToken } = axios;
let isCitiesFetchingProcess = false;

function registration(payload) {
  return axios.post(`${HOST}/api/v1/registration/`, payload);
}

function getBeneficiarByEmail(email) {
  return axios.get(`${HOST}/api/v1/get-beneficiar-by-email/`, {
    params: { email }
  });
}

export function sendVerificationCode(payload) {
  return axios.post(`${HOST}/api/v1/send-verification-code/`, payload);
}

export function signUpToWebinar(payload) {
  return axios.post(`${HOST}/api/v1/sign-up-to-webinar/`, payload);
}

function fetchCities(locale, city) {
  const source = CancelToken.source();

  if (city.length < 2) return Promise.resolve([]);

  if (isCitiesFetchingProcess) {
    source.cancel("Operation canceled by the user.");
  }

  isCitiesFetchingProcess = true;

  return axios
    .get(`${HOST}/api/v1/fetch-cities/`, {
      cancelToken: source.token,
      params: {
        locale,
        city
      }
    })
    .then(response => {
      isCitiesFetchingProcess = false;

      return response;
    })
    .catch(error => {
      isCitiesFetchingProcess = false;

      if (error.response) {
        throw new Error(error.response.data.error);
      }
    });
}

function getWebinarRecording(payload) {
  return axios.post(`${HOST}/api/v1/get-webinar-recording/`, payload);
}

export default {
  registration,
  getBeneficiarByEmail,
  sendVerificationCode,
  signUpToWebinar,
  fetchCities,
  getWebinarRecording
};
