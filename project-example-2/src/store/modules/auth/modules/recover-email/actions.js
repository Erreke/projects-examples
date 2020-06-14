import authAPI from "@/api/auth";

export default {
  RECOVER_EMAIL({ commit }, actionCode) {
    let recoveredEmail = null;

    commit("CLEAR_ALL_ERRORS");
    commit("SET_PROCESSING", true);

    return authAPI
      .checkActionCode(actionCode)
      .then(response => {
        recoveredEmail = response.data.email;
      })
      .then(() => authAPI.applyActionCode(actionCode))
      .then(() => authAPI.sendPasswordResetEmail(recoveredEmail))
      .then(() => authAPI.recoverEmailInProfile(recoveredEmail))
      .then(() => {
        commit("SET_PROCESSING", false);
        commit("SET_POPUP_OPENED_STATUS", false);
        commit("SET_RESULT", true);

        commit("auth/SET_ACTIVE_TAB", "login", { root: true });
        commit("auth/SET_POPUP_OPENED_STATUS", true, { root: true });

        return true;
      })
      .catch(error => {
        commit("SET_PROCESSING", false);
        commit("PUSH_ERROR", error.code.replace("auth/", ""));

        return false;
      });
  }
};
