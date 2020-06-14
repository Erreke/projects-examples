import axios from 'axios';
import { HOST } from '@/config';

function getWebinarRecording(payload) {
  return axios.post(`${HOST}/api/v1/get-webinar-recording/`, payload);
}

export default {
  getWebinarRecording,
};
