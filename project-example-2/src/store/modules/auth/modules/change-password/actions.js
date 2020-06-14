import authAPI from "@/api/auth";

export default {
  CHANGE_USER_PASSWORD({ commit }, { currentPassword, password }) {
    commit("CLEAR_ALL_ERRORS");
    commit("SET_PROCESSING", true);

    return authAPI
      .changeUserPassword(currentPassword, password)
      .then(() => {
        commit("SET_RESULT", true);
        commit("SET_PROCESSING", false);

        return true;
      })
      .catch(error => {
        commit("SET_PROCESSING", false);
        commit("PUSH_ERROR", error.code.replace("auth/", ""));

        return false;
      });
  }
};
