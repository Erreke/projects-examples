import clearError from '@/store/helpers/clear-error';

export default {
  CLEAR_ERROR(state, key) {
    if (state.errors.length) {
      state.errors = clearError(state.errors, key);
    }
  },

  CLEAR_ERRORS(state) {
    state.errors = [];
  },

  MERGE_FORM_ERRORS(state, payload) {
    state.errors = [
      ...state.errors,
      ...payload,
    ];
  },

  SET_FORM_PROCESSING(state, payload) {
    state.isFormProcessing = payload;
  },

  SET_WEBINAR_RECORD_URL(state, payload) {
    state.webinarRecordURL = payload;
  },
};
