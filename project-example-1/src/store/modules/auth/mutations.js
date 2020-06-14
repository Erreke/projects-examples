import initialState from './initial-state';

export default {
  SET_ACTIVE_TAB(state, payload) {
    state.activeTab = payload;
  },

  SET_POPUP_OPENED_STATUS(state, payload) {
    state.isAuthPopupOpened = payload;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState);
  },
};
