import authAPI from "@/api/auth";

export default {
  SEND_PASSWORD_RESET_EMAIL({ commit }, email) {
    commit("auth/sign-up/CLEAR_ALL_ERRORS", null, { root: true });
    commit("auth/sign-in/CLEAR_ALL_ERRORS", null, { root: true });
    commit("CLEAR_ALL_ERRORS");

    commit("SET_PROCESSING", true);

    return authAPI
      .sendPasswordResetEmail(email)
      .then(() => {
        commit("SET_RESULT", true);
        commit("auth/SET_ACTIVE_TAB", "login", { root: true });
        commit("auth/SET_POPUP_OPENED_STATUS", true, { root: true });
        commit("SET_PROCESSING", false);
      })
      .catch(error => {
        commit("SET_PROCESSING", false);
        commit("PUSH_ERROR", error.code.replace("auth/", ""));
      });
  }
};
