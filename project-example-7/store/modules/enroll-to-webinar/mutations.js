import clearError from '@/store/helpers/clear-error';

export default {
  SET_PAGE_DETAILS_LOADING(state, payload) {
    state.isPageDetailsLoading = payload;
  },

  SET_PAGE_DETAILS_LOADING_ERROR(state, payload) {
    state.isPageDetailsLoadingError = payload;
  },

  SET_PAGE_DETAILS(state, payload) {
    state.pageDetails = payload;
  },

  CLEAR_ERROR(state, key) {
    if (state.formErrors.length) {
      state.formErrors = clearError(state.formErrors, key);
    }
  },

  CLEAR_ERRORS(state) {
    state.formErrors = [];
  },

  MERGE_FORM_ERRORS(state, payload) {
    state.formErrors = [
      ...state.formErrors,
      ...payload,
    ];
  },

  SET_FORM_PROCESSING(state, payload) {
    state.isFormProcessing = payload;
  },

  SET_ENROLL_TO_WEBINAR_RESULT(state, payload) {
    state.isEnrolledToWebinar = payload;
  },

  SET_FORM_ERRORS_EXTRA(state, payload) {
    state.errorExtra = payload;
  },
};
