export default {
  TOGGLE_SIDEBAR(state) {
    state.isSidebarOpened = !state.isSidebarOpened;
  },

  CLOSE_SIDEBAR(state) {
    state.isSidebarOpened = false;
  },

  TOGGLE_MOBILE_NAVBAR(state) {
    state.isMobileNavbarOpened = !state.isMobileNavbarOpened;
  },

  CLOSE_MOBILE_NAVBAR(state) {
    state.isMobileNavbarOpened = false;
  }
};
