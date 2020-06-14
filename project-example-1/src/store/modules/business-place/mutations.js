export default {
  SET_USER_BUSINESS_PLACES(state, payload) {
    state.items = payload.items;
  },

  SET_USER_BUSINESS_PLACES_LOADING(state, payload) {
    state.isLoading = payload;
  },

  SET_SELECTED_PACKAGE_ERROR(state, payload) {
    state.selectedPackageSavingError = payload;
  },

  SET_SELECTED_PACKAGE_SAVING_PROCESS(state, payload) {
    state.isSelectedPackageSaving = payload;
  },

  SET_INSTIME_PAY_ATTEMPTING_PROCESS(state, payload) {
    state.isAttemptingToPayInstime = payload;
  },

  SET_INSTIME_PAY_ATTEMPTING_ERROR(state, payload) {
    state.instimePayAttemptingError = payload;
  },

  SET_AUTOMATON_PAY_ATTEMPTING_PROCESS(state, payload) {
    state.isAttemptingToPay = payload;
  },

  SET_AUTOMATON_PAY_ATTEMPTING_ERROR(state, payload) {
    state.automatonPayAttemptingError = payload;
  },

  SET_INSTIME_PAYMENT_INFO_CHECKING_PROCESS(state, payload) {
    state.isInstimePaymentInfoChecking = payload;
  },

  SET_INSTIME_PAYMENT_INFO_CHECKING_ERROR(state, payload) {
    state.instimePaymentInfoCheckingError = payload;
  },

  SET_AUTOMATON_PAYMENT_INFO_CHECKING_PROCESS(state, payload) {
    state.isPaymentInfoChecking = payload;
  },

  SET_AUTOMATON_PAYMENT_INFO_CHECKING_ERROR(state, payload) {
    state.automatonPaymentInfoCheckingError = payload;
  },

  SET_BUSINESS_PLACE_FIELD_SAVING_PROCESS(state, payload) {
    state.isBusinessPlaceFieldSaving = payload;
  },

  MERGE_BUSINESS_PLACE_FIELD_SAVING_ERROR(state, payload) {
    state.businessPlaceFieldSavingErrors = [...state.businessPlaceFieldSavingErrors, ...payload];
  },

  CLEAR_ALL_BUSINESS_PLACE_FIELD_SAVING_ERRORS(state) {
    state.businessPlaceFieldSavingErrors = [];
  },

  SET_CANCEL_BUYING_PROCESS(state, payload) {
    state.isBuyCancelling = payload;
  },
};
