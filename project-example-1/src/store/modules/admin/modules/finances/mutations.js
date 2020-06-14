export default {
  SET_FINANCES(state, payload) {
    state.finances = payload;
  },

  SET_LOADING(state, payload) {
    state.isLoading = payload;
  },
};
