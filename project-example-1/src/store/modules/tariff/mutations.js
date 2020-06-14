export default {
  SET_TARIFFS(state, payload) {
    state.items = payload.items;
  },

  SET_TARIFFS_LOADING(state, payload) {
    state.isLoading = payload;
  },

  SET_TARIFFS_LOADING_ERROR(state, payload) {
    state.loadingError = payload;
  },

  SET_TARIFFS_SELECTING(state, payload) {
    state.isSelecting = payload;
  },

  SET_TARIFFS_SELECTING_ERROR(state, payload) {
    state.selectingError = payload;
  },

  SET_TARIFFS_SELECTING_RESULT(state, payload) {
    state.isSelectingSuccess = payload;
  },

  SET_CANCEL_BUYING_PROCESS(state, payload) {
    state.isBuyCancelling = payload;
  },

  SET_ATTEMPTING_TO_PAY_PROCESS(state, payload) {
    state.isAttemptingToPay = payload;
  },
};
