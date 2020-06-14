import axios from 'axios';
import { API_HOST } from '../config';

export default {
  sendToAmo(payload) {
    return axios.post(`${API_HOST}/api/v1/registration/`, payload);
  },
};
