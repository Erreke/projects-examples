export default {
  SET_LESSONS(state, payload) {
    state.items[payload.cid] = payload.lessons;
  },

  SET_LESSONS_FETCHING(state, payload) {
    state.isLessonFetching = payload;
  },

  SET_LESSONS_ERROR(state, payload) {
    state.lessonFetchingError = payload;
  },

  SET_ENROLLING(state, payload) {
    state.isEnrollingToCourse = payload;
  }
};
