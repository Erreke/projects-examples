import createI18n from "@/i18n";
const i18n = createI18n();

export default {
  SET_ALL_COURSES(state, payload) {
    state.items = payload;
    state.allCoursesLoaded = true;
  },

  SET_ALL_COURSES_FETCHING(state, payload) {
    state.isAllCorsesFetching = payload;
  },

  SET_ALL_COURSES_ERROR(state, payload) {
    state.allCorsesFetchingError = payload;
  },

  SET_META_INFO(state, payload) {
    state.categories = payload.categories[i18n.locale].sort();
    state.languages = payload.languages.audio.sort();
    state.subtitles = payload.languages.subtitles.sort();
  },

  SET_META_INFO_FETCHING(state, payload) {
    state.isMetaInfoLoading = payload;
  },

  SET_META_INFO_ERROR(state, payload) {
    state.metaInfoError = payload;
  },

  SET_ENROLLING(state, payload) {
    state.isEnrollingToCourse = payload;
  },

  CHANGE_VIEW_TYPE(state, payload) {
    state.viewType = payload;
  },

  SET_COURSE_FETCHING(state, payload) {
    state.isCourseFetching = payload;
  },

  SET_COURSE_ERROR(state, payload) {
    state.courseFetchingError = payload;
  },

  SET_COURSE(state, payload) {
    state.items[payload.id] = payload;
  }
};
