import initialState from "./initial-state";

export default {
  SET_USER(state, payload) {
    state.profile = payload;
  },

  UPDATE_USER(state, payload) {
    state.profile = {
      ...state.profile,
      ...payload
    };
  },

  SET_PROFILE_CHANGING_PROCESS(state, payload) {
    state.isProfileChanging = payload;
  },

  SET_FOLLOWERS_FETCHING_PROCESS(state, payload) {
    state.isProfileChanging = payload;
  },

  SET_USER_FOLLOWERS(state, payload) {
    state.followers = payload.followers;
  },

  SET_WARNING_CLOSING_PROCESS(state, payload) {
    state.isWarningClosing = payload;
  },

  SET_AVATAR_SAVING_PROCESS(state, payload) {
    state.isAvatarSaving = payload;
  },

  SET_TRANSACTION_SAVING_PROCESS(state, payload) {
    state.isTransactionSaving = payload;
  },

  SET_PROJECT_LINK_SAVING_PROCESS(state, payload) {
    state.isReferralLinkSaving = payload;
  },

  SET_PROJECT_LINK_CHANGING_PROCESS(state, payload) {
    state.isReferralLinkChanging = payload;
  },

  SET_TRANSACTION_CHANGING_PROCESS(state, payload) {
    state.isTransactionChanging = payload;
  },

  SET_PROFILE_SAVING_PROCESS(state, payload) {
    state.isProfileSaving = payload;
  },

  SET_CITY_FETCHING_PROCESS(state, payload) {
    state.isFetchingCities = payload;
  },

  SET_FETCHED_CITIES(state, payload) {
    state.fetchedCities = payload;
  },

  CLEAR_CITY_FETCHING_ERROR(state) {
    state.cityFetchingError = null;
  },

  SET_CITY_FETCHING_ERROR(state, payload) {
    state.cityFetchingError = payload;
  },

  SET_USER_DISCOUNT(state, payload) {
    state.discountDeadline = payload.deadline;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState);
  }
};
