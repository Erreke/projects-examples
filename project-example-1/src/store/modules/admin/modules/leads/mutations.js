export default {
  SET_ITEMS(state, payload) {
    state.items = payload;
  },

  SET_LOADING(state, payload) {
    state.isLoading = payload;
  },

  SET_ERROR(state, payload) {
    state.error = payload;
  },
};
