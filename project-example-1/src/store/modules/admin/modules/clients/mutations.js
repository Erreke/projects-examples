import clearError from '@/store/helpers/clear-error';

export default {
  SET_CLIENTS_PROFILES(state, payload) {
    state.clients = payload;
  },

  SET_CLIENTS_DISCOUNTS(state, payload) {
    state.discounts = payload;
  },

  SET_CLIENTS_QUEUE(state, payload) {
    state.clientsQueue = payload;
  },

  SET_CLIENT_DISCOUNT_DEADLINE_SAVING(state, payload) {
    state.discountDeadlineSaving = payload;
  },

  SET_CLIENT_CREATING_PROCESS(state, payload) {
    state.isClientSaving = payload;
  },

  MERGE_CLIENT_CREATING_ERROR(state, payload) {
    state.clientCreatingErrors = [
      ...state.clientCreatingErrors,
      ...payload,
    ];
  },

  CLEAR_CLIENT_CREATING_ERROR(state, key) {
    if (state.clientCreatingErrors.length) {
      state.clientCreatingErrors = clearError(state.clientCreatingErrors, key);
    }
  },

  CLEAR_ALL_CLIENT_CREATING_ERRORS(state) {
    state.clientCreatingErrors = [];
  },

  SET_CLIENTS_PROFILES_LOADING(state, payload) {
    state.isClientsLoading = payload;
  },
};
