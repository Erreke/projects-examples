import initialState from './initial-state';

export default {
  TOGGLE_SIDEBAR_ACTIVE_STATE(state, payload) {
    state.isSidebarActive = payload;
  },

  SET_CONGRATULATION_CLOSING_PROCESS(state, payload) {
    state.isCongratulationClosing = payload;
  },

  SET_PSEUDO_TABLE_ACIVE_ID(state, payload) {
    state.activePseudoTableId = payload;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState);
  },
};
