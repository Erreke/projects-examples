import protoMutations from "@/store/modules/auth/proto-mutations";
import clearError from "@/store/helpers/clear-error";

export default {
  ...protoMutations(),

  CLEAR_ALL_FIRST_FORM_ERRORS(state) {
    state.firstFormErrors = [];
  },

  CLEAR_FIRST_FORM_ERROR(state, key) {
    if (state.firstFormErrors.length) {
      state.firstFormErrors = clearError(state.firstFormErrors, key);
    }
  },

  SET_FIRST_FORM_PROCESSING(state, payload) {
    state.isFirstFormProcessing = payload;
  },

  SET_FIRST_FORM_RESULT(state, payload) {
    state.firstFormResult = payload;
  },

  PUSH_FIRST_FORM_ERROR(state, payload) {
    state.firstFormErrors.push(payload);
  },

  CLEAR_ALL_SECOND_FORM_ERRORS(state) {
    state.secondFormErrors = [];
  },

  CLEAR_SECOND_FORM_ERROR(state, key) {
    if (state.secondFormErrors.length) {
      state.secondFormErrors = clearError(state.secondFormErrors, key);
    }
  },

  SET_SECOND_FORM_PROCESSING(state, payload) {
    state.isSecondFormProcessing = payload;
  },

  SET_SECOND_FORM_RESULT(state, payload) {
    state.secondFormResult = payload;
  },

  PUSH_SECOND_FORM_ERROR(state, payload) {
    state.secondFormErrors.push(payload);
  },

  SET_TEMP_NEW_PHONE_NUMBER(state, payload) {
    state.tempNewPhoneNumber = payload;
  }
};
