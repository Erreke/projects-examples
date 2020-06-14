export default {
  SET_CREATE_OR_UPDATE_PROCESSING(state, payload) {
    state.isCreateOrUpdateProcessing = payload;
  },

  SET_CREATING_ERROR(state, payload) {
    state.creatingError = payload;
  },

  CLEAR_CREATING_ERROR(state) {
    state.creatingError = null;
  },

  SET_UPDATING_ERROR(state, payload) {
    state.updatingError = payload;
  },

  CLEAR_UPDATING_ERROR(state) {
    state.updatingError = null;
  },

  SET_DELETING_PROCESS(state, payload) {
    state.isDeleting = payload;
  },

  SET_DELETING_ERROR(state, payload) {
    state.deletingError = payload;
  },

  CLEAR_DELETING_ERROR(state) {
    state.deletingError = null;
  },

  CLEAR_REDIRECT_INFO(state) {
    state.info = {};
    state.errors = null;
  },

  SET_REDIRECT_INFO(state, payload) {
    state.info = payload;
  },

  SET_REDIRECT_INFO_ERRORS(state, payload) {
    state.errors = payload;
  },

  CLEAR_ALL_REDIRECTS_INFO(state) {
    state.allInfo = [];
    state.allErrors = null;
  },

  SET_ALL_REDIRECTS_INFO(state, payload) {
    state.allInfo = payload;
  },

  SET_ALL_REDIRECTS_INFO_ERRORS(state, payload) {
    state.allErrors = payload;
  },

  SET_ALL_REDIRECTS_INFO_PROCESSING(state, payload) {
    state.isAllInfoLoading = payload;
  },

  CLEAR_AVAILABLE_PHONES_ERRORS(state) {
    state.availablePhonesErrors = null;
  },

  SET_AVAILABLE_PHONES_PROCESSING(state, payload) {
    state.isAvailablePhonesProcessing = payload;
  },

  SET_AVAILABLE_PHONES(state, payload) {
    state.availablePhones = payload;
  },

  SET_AVAILABLE_PHONES_ERRORS(state, payload) {
    state.availablePhonesErrors = payload;
  },

  SET_CREATE_OR_UPDATE_FORM_ITEM(state, { type, value }) {
    state.createOrUpdateFormItems[type] = value;
  },

  CLEAR_CREATE_OR_UPDATE_FORM(state) {
    state.createOrUpdateFormItems = {
      type: 'whatsapp',
      redirectFrom: '',
      redirectTo: '',
      phone: '',
      text: '',
      file: null,
      isFileChanged: false,
    };
  },

  INIT_CREATE_OR_UPDATE_FORM_ITEMS(state, payload) {
    state.createOrUpdateFormItems = payload;
  },
};
