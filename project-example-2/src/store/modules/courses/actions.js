import coursesAPI from "@/api/courses";

export default {
  FETCH_ALL_COURSES({ state, commit }) {
    commit("SET_ALL_COURSES_ERROR", null);
    commit("SET_ALL_COURSES_FETCHING", true);

    if (state.allCoursesLoaded) {
      commit("SET_ALL_COURSES_FETCHING", false);

      return Promise.resolve(true);
    }

    return coursesAPI
      .fetchAllCourses()
      .then(response => {
        commit("SET_ALL_COURSES", response);
        commit("SET_ALL_COURSES_FETCHING", false);
      })
      .catch(error => {
        commit("SET_ALL_COURSES_ERROR", error);
        commit("SET_ALL_COURSES_FETCHING", false);
      });
  },

  FETCH_META_INFO({ state, commit }) {
    commit("SET_META_INFO_ERROR", null);
    commit("SET_META_INFO_FETCHING", true);

    if (
      state.categories.length > 0 &&
      state.languages.length > 0 &&
      state.subtitles.length > 0
    ) {
      commit("SET_META_INFO_FETCHING", false);

      return Promise.resolve(true);
    }

    return coursesAPI
      .fetchMetaInfo()
      .then(response => {
        commit("SET_META_INFO", response);
        commit("SET_META_INFO_FETCHING", false);
      })
      .catch(error => {
        commit("SET_META_INFO_ERROR", error);
        commit("SET_META_INFO_FETCHING", false);
      });
  },

  FETCH_COURSE({ state, commit }, id) {
    commit("SET_COURSE_ERROR", null);
    commit("SET_COURSE_FETCHING", true);

    if (state.items[id]) {
      commit("SET_COURSE_FETCHING", false);

      return Promise.resolve(true);
    }

    return coursesAPI
      .fetchCourse(id)
      .then(response => {
        if (response) {
          commit("SET_COURSE", response);
          commit("SET_COURSE_FETCHING", false);

          return true;
        } else {
          commit("SET_COURSE_FETCHING", false);

          return false;
        }
      })
      .catch(error => {
        commit("SET_COURSE_ERROR", error);
        commit("SET_COURSE_FETCHING", false);

        return false;
      });
  },
};
