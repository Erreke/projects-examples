export default {
  SET_BUSINESS_PLACES_FETCHING_PROCESS(state, payload) {
    state.isLoading = payload;
  },

  SET_BUSINESS_PLACES_ERROR(state, payload) {
    state.error = payload;
  },

  SET_BUSINESS_PLACES(state, payload) {
    state.tree = payload.tree;
    state.items = payload.items;
  },

  OPEN_DETAILS_DIALOG(state) {
    state.isDetailsDialogOpened = true;
  },

  CLOSE_DETAILS_DIALOG(state) {
    state.isDetailsDialogOpened = false;
  },

  SET_CURRENT_ITEM_ID(state, payload) {
    state.currentItemId = payload;
  },

  SET_SYNCING_PROCESS(state, payload) {
    state.isSyncing = payload;
  },

  SET_ASSIGN_TO_USER_PROCESS(state, payload) {
    state.isAssigning = payload;
  },

  OPEN_ASSIGN_DIALOG(state) {
    state.isAssignDialogOpened = true;
  },

  CLOSE_ASSIGN_DIALOG(state) {
    state.isAssignDialogOpened = false;
  },
};
