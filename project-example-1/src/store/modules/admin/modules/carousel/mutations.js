export default {
  SET_CAROUSEL_META_FETCHING_RESULT(state, payload) {
    state.meta = payload;
  },

  SET_CAROUSEL_META_FETCHING(state, payload) {
    state.isMetaFetching = payload;
  },

  SET_CAROUSEL_META_FETCHING_ERROR(state, payload) {
    state.metaFetchingError = payload;
  },


  SET_CAROUSEL_REFLINKS_FETCHING_RESULT(state, payload) {
    state.reflinks = payload;
  },

  SET_CAROUSEL_REFLINKS_FETCHING(state, payload) {
    state.isReflinksFetching = payload;
  },

  SET_CAROUSEL_REFLINKS_FETCHING_ERROR(state, payload) {
    state.reflinksFetchingError = payload;
  },


  SET_CAROUSEL_FINALLINKS_FETCHING_RESULT(state, payload) {
    state.finallinks = payload;
  },

  SET_CAROUSEL_FINALLINKS_FETCHING(state, payload) {
    state.isFinallinksFetching = payload;
  },

  SET_CAROUSEL_FINALLINKS_FETCHING_ERROR(state, payload) {
    state.finallinksFetchingError = payload;
  },


  SET_CAROUSEL_META_SAVING_RESULT(state, payload) {
    state.isMetaSaved = payload;
  },

  SET_CAROUSEL_META_SAVING(state, payload) {
    state.isMetaSaving = payload;
  },

  SET_CAROUSEL_META_SAVING_ERROR(state, payload) {
    state.metaSavingError = payload;
  },


  SET_CAROUSEL_REFLINK_SAVING_RESULT(state, payload) {
    state.isReflinkSaved = payload;
  },

  SET_CAROUSEL_REFLINK_SAVING(state, payload) {
    state.isReflinkSaving = payload;
  },

  SET_CAROUSEL_REFLINK_SAVING_ERROR(state, payload) {
    state.reflinkSavingError = payload;
  },


  SET_CAROUSEL_REFLINK_DELETING_RESULT(state, payload) {
    state.isReflinkDeleted = payload;
  },

  SET_CAROUSEL_REFLINK_DELETING(state, payload) {
    state.isReflinkDeleting = payload;
  },

  SET_CAROUSEL_REFLINK_DELETING_ERROR(state, payload) {
    state.reflinkDeletingError = payload;
  },


  SET_CAROUSEL_REFLINK_ADDING_RESULT(state, payload) {
    state.isReflinkAdded = payload;
  },

  SET_CAROUSEL_REFLINK_ADDING(state, payload) {
    state.isReflinkAdding = payload;
  },

  SET_CAROUSEL_REFLINK_ADDING_ERROR(state, payload) {
    state.reflinkAddingError = payload;
  },


  SET_META_INFO(state, payload) {
    state.meta[payload.key] = payload.value;
  },
};
