import lessonsAPI from "@/api/lessons";

export default {
  FETCH_LESSONS({ state, commit }, cid) {
    commit("SET_LESSONS_ERROR", null);
    commit("SET_LESSONS_FETCHING", true);

    if (state.items[cid]) {
      commit("SET_LESSONS_FETCHING", false);

      return Promise.resolve(true);
    }

    return lessonsAPI
      .fetchLessons(cid)
      .then(response => {
        if (response) {
          commit("SET_LESSONS", response);
          commit("SET_LESSONS_FETCHING", false);

          return true;
        } else {
          commit("SET_LESSONS_FETCHING", false);

          return false;
        }
      })
      .catch(error => {
        commit("SET_LESSONS_ERROR", error);
        commit("SET_LESSONS_FETCHING", false);

        return false;
      });
  }
};
