import initialState from "./initial-state";

export default {
  RESET_STATE(state) {
    Object.assign(state, initialState);
  },

  SET_SIGN_IN_BY_SMS_FIRST_STEP_ERROR(state, payload) {
    state.signInBySMSFirstStepError = payload;
  },

  CLEAR_SIGN_IN_BY_SMS_FIRST_STEP_ERROR(state) {
    state.signInBySMSFirstStepError = null;
  },

  SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_PROCESS(state, payload) {
    state.isSignInBySMSFirstStepProcessing = payload;
  },

  SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_COMPLETE(state, payload) {
    state.isSignInBySMSFirstStepCompleted = payload;
  },

  SET_SIGN_IN_BY_SMS_SECOND_STEP_ERROR(state, payload) {
    state.signInBySMSSecondStepError = payload;
  },

  CLEAR_SIGN_IN_BY_SMS_SECOND_STEP_ERROR(state) {
    state.signInBySMSSecondStepError = null;
  },

  SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_PROCESS(state, payload) {
    state.isSignInBySMSSecondStepProcessing = payload;
  },

  SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_COMPLETE(state, payload) {
    state.isSignInBySMSSecondStepCompleted = payload;
  },

  SET_SIGN_IN_BY_EMAIL_FIRST_STEP_ERROR(state, payload) {
    state.signInByEmailFirstStepError = payload;
  },

  CLEAR_SIGN_IN_BY_EMAIL_FIRST_STEP_ERROR(state) {
    state.signInByEmailFirstStepError = null;
  },

  SET_STATUS_TO_SIGN_IN_BY_EMAIL_FIRST_STEP_PROCESS(state, payload) {
    state.isSignInByEmailFirstStepProcessing = payload;
  },

  SET_STATUS_TO_SIGN_IN_BY_EMAIL_FIRST_STEP_COMPLETE(state, payload) {
    state.isSignInByEmailFirstStepCompleted = payload;
  },

  SET_SIGN_IN_BY_EMAIL_SECOND_STEP_ERROR(state, payload) {
    state.signInByEmailSecondStepError = payload;
  },

  CLEAR_SIGN_IN_BY_EMAIL_SECOND_STEP_ERROR(state) {
    state.signInByEmailSecondStepError = null;
  },

  SET_STATUS_TO_SIGN_IN_BY_EMAIL_SECOND_STEP_PROCESS(state, payload) {
    state.isSignInByEmailSecondStepProcessing = payload;
  },

  SET_STATUS_TO_SIGN_IN_BY_EMAIL_SECOND_STEP_COMPLETE(state, payload) {
    state.isSignInByEmailSecondStepCompleted = payload;
  },

  SET_STATUS_TO_SIGN_OUT_PROCESS(state, payload) {
    state.isSignOutProcessing = payload;
  },

  CLEAR_SIGN_IN_ERROR(state) {
    state.signInSecondStepError = null;
  },

  SET_USER(state, payload) {
    state.user = payload;
  },

  UNSET_USER(state) {
    state.user = null;
  },

  SET_STREAM(state, payload) {
    state.stream = payload;
  },

  SET_STREAM_NOT_FOUND_STATUS(state, payload) {
    state.isStreamNotFound = payload;
  },

  SET_COMMENTS(state, payload) {
    state.comments = (payload && payload.list) || {};
  },

  SET_MEMBERS(state, payload) {
    state.members = (payload && payload.list) || {};
  },

  SET_MESSAGE_SENDING_STATUS(state, payload) {
    state.isMessageSendProcessing = payload;
  },

  SET_SEND_MESSAGE_ERROR(state, payload) {
    state.sendMessageError = payload;
  },

  CLEAR_SEND_MESSAGE_ERROR(state) {
    state.sendMessageError = null;
  },

  UNSUBSCRIBE_FROM_FIRESTORE(state) {
    state.isUnsubscribedFromFirestore = true;
  }
};
