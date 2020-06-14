export default {
  SET_ALL_TARIFF(state, payload) {
    state.items = payload;
  },

  SET_ALL_TARIFF_FETCHING(state, payload) {
    state.isLoading = payload;
  },

  SET_ALL_TARIFF_FETCHING_ERROR(state, payload) {
    state.loadingError = payload;
  },

  SET_PAYMENT_CONFIRMING(state, payload) {
    state.isPaymentConfirming = payload;
  },

  SET_PAYMENT_CONFIRMING_ERROR(state, payload) {
    state.paymentConfirmingError = payload;
  },

  SET_AD_RUNNING(state, payload) {
    state.isAdRunning = payload;
  },

  SET_AD_RUNNING_ERROR(state, payload) {
    state.adRunningError = payload;
  },

  SET_AD_STOPPING(state, payload) {
    state.isAdStopped = payload;
  },

  SET_AD_STOPPING_ERROR(state, payload) {
    state.adStoppingError = payload;
  },

  SET_AD_EXPIRING(state, payload) {
    state.isAdExpiring = payload;
  },

  SET_AD_EXPIRING_ERROR(state, payload) {
    state.adExpiringError = payload;
  },

  SET_ORDER_DELETING(state, payload) {
    state.isOrderDeleting = payload;
  },

  SET_ORDER_DELETING_ERROR(state, payload) {
    state.orderDeletingError = payload;
  },
};
