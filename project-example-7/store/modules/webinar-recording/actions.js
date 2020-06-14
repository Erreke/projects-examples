import webinarRecordingAPI from '@/api/webinar-recording';

export default {
  GET_WEBINAR_RECORDING({ commit }, payload) {
    commit('CLEAR_ERRORS');
    commit('SET_FORM_PROCESSING', true);

    return webinarRecordingAPI.getWebinarRecording(payload)
      .then((response) => {
        commit('SET_FORM_PROCESSING', false);
        commit('SET_WEBINAR_RECORD_URL', response.data.url);

        return {
          success: true,
          url: response.data.url,
        };
      })
      .catch((error) => {
        commit('MERGE_FORM_ERRORS', error.response.data.errors);
        commit('SET_FORM_PROCESSING', false);

        return {
          success: false,
        };
      });
  },

};
